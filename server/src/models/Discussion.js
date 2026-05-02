const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },
  title: { type: String, maxlength: 200 },
  content: { type: String, required: true, maxlength: 2000 },
  isResolved: { type: Boolean, default: false },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String, lowercase: true }],
}, { timestamps: true });

DiscussionSchema.index({ course: 1, createdAt: -1 });
DiscussionSchema.index({ lesson: 1, createdAt: -1 });
DiscussionSchema.index({ createdAt: -1 }); // Index for global feed
DiscussionSchema.index({ title: 'text', content: 'text' }); // Index for search

module.exports = mongoose.model('Discussion', DiscussionSchema);