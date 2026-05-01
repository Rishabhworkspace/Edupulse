const Coupon = require('../models/Coupon');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { paginate, paginationMeta } = require('../utils/paginate');
const { createObjectCsvStringifier } = require('csv-writer');

// POST /api/v1/coupons
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(new ApiResponse(201, coupon, 'Coupon created'));
});

// GET /api/v1/coupons
const listCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isActive, search } = req.query;
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) filter.code = new RegExp(search, 'i');
  const { skip, limit: lim } = paginate(req.query, { page, limit });
  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim),
    Coupon.countDocuments(filter),
  ]);
  res.json(new ApiResponse(200, coupons, 'Coupons fetched', paginationMeta(total, page, limit)));
});

// GET /api/v1/coupons/:id
const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id).populate('courses', 'title slug');
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(new ApiResponse(200, coupon));
});

// PATCH /api/v1/coupons/:id
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(new ApiResponse(200, coupon, 'Coupon updated'));
});

// DELETE /api/v1/coupons/:id
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(new ApiResponse(200, {}, 'Coupon deactivated'));
});

// POST /api/v1/coupons/validate
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, courseId, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(404, 'Invalid coupon code');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new ApiError(410, 'Coupon has expired');
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new ApiError(422, 'Coupon usage limit reached');
  if (coupon.applicableTo === 'course' && courseId && !coupon.courses.map(String).includes(courseId)) {
    throw new ApiError(400, 'Coupon not valid for this course');
  }
  if (orderAmount < (coupon.minOrderAmount || 0)) {
    throw new ApiError(400, `Minimum order amount ₹${coupon.minOrderAmount} required`);
  }
  const userUsed = coupon.usedBy.filter((u) => u.user.toString() === req.user._id.toString()).length;
  if (userUsed >= coupon.perUserLimit) throw new ApiError(422, 'You have already used this coupon');

  const discountAmount = coupon.type === 'percentage' ? (orderAmount * coupon.value) / 100 : coupon.value;
  const finalAmount = Math.max(0, orderAmount - discountAmount);

  res.json(new ApiResponse(200, {
    valid: true,
    discountType: coupon.type,
    discountValue: coupon.value,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalAmount: Math.round(finalAmount * 100) / 100,
    couponId: coupon._id,
  }));
});

// POST /api/v1/coupons/bulk-generate
const bulkGenerate = asyncHandler(async (req, res) => {
  const { count = 10, prefix = 'BULK', type, value, expiresAt, maxUses = 1, campaign } = req.body;
  const codes = [];
  for (let i = 0; i < Math.min(count, 500); i++) {
    codes.push({
      code: `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      type, value, expiresAt, maxUses, perUserLimit: 1,
      campaign, createdBy: req.user._id, isActive: true,
    });
  }
  const coupons = await Coupon.insertMany(codes, { ordered: false });

  // CSV response
  const csv = coupons.map((c) => `${c.code},${c.type},${c.value},${c.expiresAt || ''}`).join('\n');
  const csvContent = `Code,Type,Value,ExpiresAt\n${csv}`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="coupons-${Date.now()}.csv"`);
  res.send(csvContent);
});

// GET /api/v1/coupons/:id/analytics
const getCouponAnalytics = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(new ApiResponse(200, {
    code: coupon.code,
    usedCount: coupon.usedCount,
    maxUses: coupon.maxUses,
    totalDiscountGiven: coupon.totalDiscountGiven,
    redemptionRate: coupon.maxUses ? ((coupon.usedCount / coupon.maxUses) * 100).toFixed(1) : null,
    isActive: coupon.isActive,
    isExpired: coupon.isExpired,
  }));
});

module.exports = { createCoupon, listCoupons, getCoupon, updateCoupon, deleteCoupon, validateCoupon, bulkGenerate, getCouponAnalytics };
