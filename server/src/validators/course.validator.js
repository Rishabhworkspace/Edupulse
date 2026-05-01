const Zod = require('zod');

const createCourseSchema = Zod.object({
  title: Zod.string().min(3).max(200),
  description: Zod.string().max(5000).optional(),
  shortDescription: Zod.string().max(500).optional(),
  category: Zod.string().optional(),
  level: Zod.enum(['beginner', 'intermediate', 'advanced']).optional(),
  language: Zod.string().default('English'),
  price: Zod.number().min(0).default(0),
  requirements: Zod.array(Zod.string()).default([]),
  outcomes: Zod.array(Zod.string()).default([]),
  tags: Zod.array(Zod.string()).default([]),
});

const updateCourseSchema = Zod.object({
  title: Zod.string().min(3).max(200).optional(),
  description: Zod.string().max(5000).optional(),
  shortDescription: Zod.string().max(500).optional(),
  thumbnail: Zod.string().url().optional(),
  previewVideo: Zod.string().url().optional(),
  category: Zod.string().optional(),
  level: Zod.enum(['beginner', 'intermediate', 'advanced']).optional(),
  language: Zod.string().optional(),
  price: Zod.number().min(0).optional(),
  originalPrice: Zod.number().min(0).optional(),
  requirements: Zod.array(Zod.string()).optional(),
  outcomes: Zod.array(Zod.string()).optional(),
  certificate: Zod.boolean().optional(),
}).strict();

const addSectionSchema = Zod.object({
  title: Zod.string().min(1).max(200),
});

const addLessonSchema = Zod.object({
  title: Zod.string().min(1).max(200),
  type: Zod.enum(['video', 'quiz', 'text', 'assignment']).default('video'),
  videoUrl: Zod.string().url().optional(),
  videoDuration: Zod.number().min(0).optional(),
  content: Zod.string().optional(),
  isPreview: Zod.boolean().default(false),
  questions: Zod.array(Zod.object({
    question: Zod.string(),
    options: Zod.array(Zod.string()).min(2),
    correctIndex: Zod.number().min(0),
    explanation: Zod.string().optional(),
  })).optional(),
}).strict();

const updateLessonSchema = addLessonSchema.partial();

const syncCurriculumSchema = Zod.object({
  curriculum: Zod.array(Zod.object({
    title: Zod.string(),
    lessons: Zod.array(addLessonSchema),
  })),
});

const reorderSchema = Zod.object({
  sectionOrder: Zod.array(Zod.object({
    id: Zod.string(),
    order: Zod.number(),
  })).optional(),
  lessonOrders: Zod.array(Zod.object({
    sectionId: Zod.string(),
    lessonId: Zod.string(),
    order: Zod.number(),
  })).optional(),
}).strict();

const reviewSchema = Zod.object({
  rating: Zod.number().min(1).max(5),
  comment: Zod.string().max(2000).optional(),
});

const courseQuerySchema = Zod.object({
  search: Zod.string().optional(),
  category: Zod.string().optional(),
  level: Zod.enum(['beginner', 'intermediate', 'advanced']).optional(),
  priceMin: Zod.coerce.number().min(0).default(0),
  priceMax: Zod.coerce.number().min(0).default(999999),
  sort: Zod.string().default('-createdAt'),
  page: Zod.coerce.number().int().positive().default(1),
  limit: Zod.coerce.number().int().positive().max(50).default(12),
  isFeatured: Zod.coerce.boolean().optional(),
}).strict();

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  addSectionSchema,
  addLessonSchema,
  updateLessonSchema,
  syncCurriculumSchema,
  reorderSchema,
  reviewSchema,
  courseQuerySchema,
};