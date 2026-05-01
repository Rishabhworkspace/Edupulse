const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'flat'], required: true },
    value: { type: Number, required: true, min: 0 },
    maxUses: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    applicableTo: { type: String, enum: ['all', 'course'], default: 'all' },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    minOrderAmount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Track per-user usage
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      },
    ],
    // Analytics
    totalDiscountGiven: { type: Number, default: 0 },
    campaign: { type: String }, // e.g., 'affiliate', 'corporate', 'welcome'
  },
  { timestamps: true }
);

CouponSchema.index({ isActive: 1, expiresAt: 1 });

// Virtual: is expired
CouponSchema.virtual('isExpired').get(function () {
  return this.expiresAt ? this.expiresAt < new Date() : false;
});

// Virtual: is max uses reached
CouponSchema.virtual('isExhausted').get(function () {
  return this.maxUses !== null && this.usedCount >= this.maxUses;
});

module.exports = mongoose.model('Coupon', CouponSchema);
