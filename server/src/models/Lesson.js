const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    type: {
      type: String,
      enum: ['video', 'article', 'quiz', 'assignment'],
      default: 'video',
    },
    videoUrl: { type: String, default: '' },
    videoDuration: { type: Number, default: 0 }, // seconds
    content: { type: String, default: '' }, // rich-text for articles
    isPreview: { type: Boolean, default: false },
    resources: [{ name: String, url: String, type: String }],
    order: { type: Number, default: 0 },
    // Quiz fields
    questions: [
      {
        question: String,
        options: [String],
        correctIndex: Number,
        explanation: String,
      },
    ],
  },
  { timestamps: true }
);

const Section = mongoose.model('Section', SectionSchema);
const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = { Section, Lesson };
