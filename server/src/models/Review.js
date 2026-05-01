const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 2000 },
    isModerated: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    instructorReply: { type: String, maxlength: 1000 },
    instructorRepliedAt: Date,
  },
  { timestamps: true }
);

ReviewSchema.index({ course: 1, user: 1 }, { unique: true });
ReviewSchema.index({ course: 1, rating: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
