const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true }, // final amount charged (after coupon)
    originalAmount: { type: Number }, // before discount
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    stripeSessionId: { type: String, unique: true, sparse: true },
    stripePaymentIntent: String,
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    discountAmount: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 }, // 10%
    instructorPayout: { type: Number, default: 0 }, // 90%
    invoiceUrl: String,
    refundedAt: Date,
    refundReason: String,
    // Idempotency
    idempotencyKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
