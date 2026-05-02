const stripe = require('../config/stripe');
const Course = require('../models/Course');
const Order = require('../models/Order');
const Enrollment = require('../models/Enrollment');
const Coupon = require('../models/Coupon');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const emailService = require('../services/emailService');
const { paginate, paginationMeta } = require('../utils/paginate');

const PLATFORM_FEE = parseFloat(process.env.PLATFORM_FEE_PERCENT || 10) / 100;

const createCheckout = asyncHandler(async (req, res) => {
  const { courseId, couponCode } = req.body;
  const course = await Course.findById(courseId).populate('instructor', 'name');
  if (!course || course.status !== 'published') throw new ApiError(404, 'Course not found');
  const enrolled = await Enrollment.findOne({ user: req.user._id, course: courseId });
  if (enrolled) throw new ApiError(409, 'Already enrolled');

  const isDevMode = stripe.isDummy;

  let finalAmount = course.price;
  let discountAmount = 0;
  let couponDoc = null;

  if (couponCode) {
    couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!couponDoc) throw new ApiError(404, 'Coupon not found');
    if (couponDoc.expiresAt && couponDoc.expiresAt < new Date()) throw new ApiError(410, 'Coupon expired');
    if (couponDoc.maxUses && couponDoc.usedCount >= couponDoc.maxUses) throw new ApiError(422, 'Coupon limit reached');
    const userUsed = couponDoc.usedBy.filter((u) => u.user.toString() === req.user._id.toString()).length;
    if (userUsed >= couponDoc.perUserLimit) throw new ApiError(422, 'Coupon already used');
    discountAmount = couponDoc.type === 'percentage' ? (course.price * couponDoc.value) / 100 : couponDoc.value;
    finalAmount = Math.max(0, course.price - discountAmount);
  }

  if (finalAmount === 0) {
    const order = await Order.create({ user: req.user._id, course: courseId, amount: 0, originalAmount: course.price, status: 'paid', coupon: couponDoc?._id, discountAmount, platformFee: 0, instructorPayout: 0 });
    await Enrollment.create({ user: req.user._id, course: courseId, order: order._id });
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
    if (couponDoc) { couponDoc.usedCount += 1; couponDoc.usedBy.push({ user: req.user._id, orderId: order._id }); await couponDoc.save(); }
    return res.json(new ApiResponse(200, { free: true }, 'Enrolled for free'));
  }

  if (isDevMode) {
    return res.json(new ApiResponse(200, { mockPayment: true, amount: finalAmount, courseId, couponCode: couponCode || null }, 'Ready for mock payment'));
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'inr', product_data: { name: course.title }, unit_amount: Math.round(finalAmount * 100) }, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/course/${course.slug}`,
    metadata: { userId: req.user._id.toString(), courseId, couponId: couponDoc?._id?.toString() || '', discountAmount: discountAmount.toString() },
  });

  await Order.create({ user: req.user._id, course: courseId, amount: finalAmount, originalAmount: course.price, stripeSessionId: session.id, coupon: couponDoc?._id, discountAmount, platformFee: finalAmount * PLATFORM_FEE, instructorPayout: finalAmount * (1 - PLATFORM_FEE) });
  res.json(new ApiResponse(200, { sessionId: session.id, url: session.url }));
});

const verifyPayment = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
  if (session.payment_status !== 'paid') throw new ApiError(400, 'Payment not completed');
  const order = await Order.findOne({ stripeSessionId: session.id });
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(new ApiResponse(200, { order, enrolled: order.status === 'paid' }));
});

const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return res.status(400).send('Webhook signature failed'); }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const order = await Order.findOne({ stripeSessionId: session.id });
    if (!order || order.status === 'paid') return res.json({ received: true });
    order.status = 'paid'; order.stripePaymentIntent = session.payment_intent;
    await order.save();
    await Enrollment.create({ user: order.user, course: order.course, order: order._id });
    await Course.findByIdAndUpdate(order.course, { $inc: { enrolledCount: 1 } });
    if (order.coupon) await Coupon.findByIdAndUpdate(order.coupon, { $inc: { usedCount: 1, totalDiscountGiven: order.discountAmount }, $push: { usedBy: { user: order.user, orderId: order._id } } });
    const pop = await Order.findById(order._id).populate('course', 'title').populate('user', 'name email');
    await emailService.sendEnrollmentConfirmation(pop.user.email, pop.user.name, pop.course.title).catch(() => {});
  }
  if (event.type === 'charge.refunded') {
    const charge = event.data.object;
    await Order.findOneAndUpdate({ stripePaymentIntent: charge.payment_intent }, { status: 'refunded', refundedAt: new Date() });
  }
  res.json({ received: true });
});

const listOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = status ? { status } : {};
  const { skip, limit: lim } = paginate(req.query, { page, limit });
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').populate('course', 'title slug').sort({ createdAt: -1 }).skip(skip).limit(lim),
    Order.countDocuments(filter),
  ]);
  res.json(new ApiResponse(200, orders, 'Orders fetched', paginationMeta(total, page, limit)));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('course', 'title thumbnail slug').sort({ createdAt: -1 });
  res.json(new ApiResponse(200, orders));
});

const refundOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status !== 'paid') throw new ApiError(400, 'Only paid orders can be refunded');
  await stripe.refunds.create({ payment_intent: order.stripePaymentIntent });
  order.status = 'refunded'; order.refundedAt = new Date(); order.refundReason = req.body.reason || '';
  await order.save();
  res.json(new ApiResponse(200, order, 'Refund initiated'));
});

const getRevenue = asyncHandler(async (req, res) => {
  const [gmv, refunds, count] = await Promise.all([
    Order.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Order.aggregate([{ $match: { status: 'refunded' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Order.countDocuments({ status: 'paid' }),
  ]);
  res.json(new ApiResponse(200, { gmv: gmv[0]?.total || 0, refundTotal: refunds[0]?.total || 0, orderCount: count, platformRevenue: (gmv[0]?.total || 0) * PLATFORM_FEE }));
});

const getInstructorRevenue = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    { $match: { status: 'paid' } },
    { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'c' } },
    { $unwind: '$c' },
    { $match: { 'c.instructor': req.user._id } },
    { $group: { _id: null, totalPayout: { $sum: '$instructorPayout' }, orderCount: { $sum: 1 } } },
  ]);
  res.json(new ApiResponse(200, result[0] || { totalPayout: 0, orderCount: 0 }));
});

const completeMockPayment = asyncHandler(async (req, res) => {
  const { courseId, couponCode } = req.body;
  const course = await Course.findById(courseId).populate('instructor', 'name');
  if (!course || course.status !== 'published') throw new ApiError(404, 'Course not found');
  
  const enrolled = await Enrollment.findOne({ user: req.user._id, course: courseId });
  if (enrolled) throw new ApiError(409, 'Already enrolled');

  let finalAmount = course.price;
  let discountAmount = 0;
  let couponDoc = null;

  if (couponCode) {
    couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!couponDoc) throw new ApiError(404, 'Coupon not found');
    if (couponDoc.expiresAt && couponDoc.expiresAt < new Date()) throw new ApiError(410, 'Coupon expired');
    if (couponDoc.maxUses && couponDoc.usedCount >= couponDoc.maxUses) throw new ApiError(422, 'Coupon limit reached');
    const userUsed = couponDoc.usedBy.filter((u) => u.user.toString() === req.user._id.toString()).length;
    if (userUsed >= couponDoc.perUserLimit) throw new ApiError(422, 'Coupon already used');
    
    discountAmount = couponDoc.type === 'percentage' ? (course.price * couponDoc.value) / 100 : couponDoc.value;
    finalAmount = Math.max(0, course.price - discountAmount);
  }

  const order = await Order.create({ 
    user: req.user._id, 
    course: courseId, 
    amount: finalAmount, 
    originalAmount: course.price, 
    status: 'paid', 
    coupon: couponDoc?._id, 
    discountAmount, 
    platformFee: finalAmount * PLATFORM_FEE, 
    instructorPayout: finalAmount * (1 - PLATFORM_FEE),
    paymentMethod: 'mock-payment'
  });
  
  await Enrollment.create({ user: req.user._id, course: courseId, order: order._id });
  await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
  
  if (couponDoc) { 
    couponDoc.usedCount += 1; 
    couponDoc.usedBy.push({ user: req.user._id, orderId: order._id }); 
    await couponDoc.save(); 
  }
  
  res.json(new ApiResponse(200, { success: true, orderId: order._id }, 'Enrollment completed'));
});

module.exports = { createCheckout, verifyPayment, handleWebhook, listOrders, getMyOrders, refundOrder, getRevenue, getInstructorRevenue, completeMockPayment };
