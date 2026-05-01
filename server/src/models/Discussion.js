const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },
  content: { type: String, required: true, maxlength: 2000 },
  isResolved: { type: Boolean, default: false },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

DiscussionSchema.index({ course: 1, createdAt: -1 });
DiscussionSchema.index({ lesson: 1, createdAt: -1 });

module.exports = mongoose.model('Discussion', DiscussionSchema);