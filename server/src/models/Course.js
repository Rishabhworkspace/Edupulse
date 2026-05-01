const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, maxlength: 5000 },
    shortDescription: { type: String, maxlength: 300 },
    thumbnail: { type: String, default: '' },
    previewVideo: { type: String, default: '' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { 
      type: String, 
      enum: ['Web Development', 'Data Science', 'Mobile Development', 'UI/UX Design', 'Cloud & DevOps', 'Cybersecurity'],
      default: 'Web Development'
    },
    tags: [{ type: String, lowercase: true }],
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    language: { type: String, default: 'English' },
    price: { type: Number, required: true, min: 0, default: 0 },
    originalPrice: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    curriculum: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
    enrolledCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'archived'],
      default: 'draft',
    },
    requirements: [String],
    outcomes: [String],
    certificate: { type: Boolean, default: true },
    totalDuration: { type: Number, default: 0 }, // seconds
    totalLessons: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

// Auto-generate slug from title
CourseSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now();
  }
  next();
});

// Indexes
CourseSchema.index({ status: 1, isFeatured: 1 });
CourseSchema.index({ title: 'text', description: 'text', tags: 'text' });
CourseSchema.index({ category: 1, level: 1, price: 1 });

module.exports = mongoose.model('Course', CourseSchema);
