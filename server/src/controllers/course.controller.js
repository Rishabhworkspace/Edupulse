const Course = require('../models/Course');
const { Section, Lesson } = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { paginate, paginationMeta } = require('../utils/paginate');
const mediaService = require('../services/mediaService');
const certificateService = require('../services/certificateService');
const logger = require('../utils/logger');

// GET /api/v1/courses — public
const getCourses = asyncHandler(async (req, res) => {
  const { search, category, level, priceMin = 0, priceMax = 999999, sort = '-createdAt', page = 1, limit = 12, isFeatured } = req.query;
  const filter = { status: 'published' };
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (isFeatured) filter.isFeatured = true;
  filter.price = { $gte: Number(priceMin), $lte: Number(priceMax) };

  if (req.query.instructor === 'me' && req.user) {
    filter.instructor = req.user._id;
    delete filter.status;
  }

  const { skip, limit: lim } = paginate(req.query, { page, limit });
  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate('instructor', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(lim)
      .select('-curriculum'),
    Course.countDocuments(filter),
  ]);
  res.json(new ApiResponse(200, courses, 'Courses fetched', paginationMeta(total, page, lim)));
});

// POST /api/v1/courses — Instructor
const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({ ...req.body, instructor: req.user._id, status: 'draft' });
  res.status(201).json(new ApiResponse(201, course, 'Course created'));
});

// GET /api/v1/courses/:slug — public
const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, status: 'published' })
    .populate('instructor', 'name avatar bio')
    .populate({
      path: 'curriculum',
      model: 'Section',
      populate: { path: 'lessons', model: 'Lesson', select: 'title type duration isPreview order videoDuration' },
    });
  if (!course) throw new ApiError(404, 'Course not found');

  // Check if enrolled
  let isEnrolled = false;
  if (req.user) {
    isEnrolled = !!(await Enrollment.findOne({ user: req.user._id, course: course._id }));
  }
  res.json(new ApiResponse(200, { ...course.toObject(), isEnrolled }));
});

// GET /api/v1/courses/:id/edit — Instructor/Admin
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name avatar')
    .populate({
      path: 'curriculum',
      model: 'Section',
      populate: { path: 'lessons', model: 'Lesson' },
    });
  if (!course) throw new ApiError(404, 'Course not found');
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorised');
  }
  res.json(new ApiResponse(200, course));
});

// PATCH /api/v1/courses/:id — Instructor or Admin
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorised');
  }
  const allowed = ['title', 'description', 'shortDescription', 'thumbnail', 'previewVideo', 'category', 'tags', 'level', 'language', 'price', 'originalPrice', 'requirements', 'outcomes', 'certificate'];
  allowed.forEach((f) => { if (req.body[f] !== undefined) course[f] = req.body[f]; });
  await course.save();
  res.json(new ApiResponse(200, course, 'Course updated'));
});

// DELETE /api/v1/courses/:id — archive
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorised');
  }
  course.status = 'archived';
  await course.save();
  res.json(new ApiResponse(200, {}, 'Course archived'));
});

// PATCH /api/v1/courses/:id/thumbnail
const updateCourseThumbnail = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorised');
  }

  if (!req.file) throw new ApiError(400, 'No image file provided');

  const cloudinary = require('../config/cloudinary');
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'course_thumbnails', public_id: `course_${course._id}_${Date.now()}` },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  course.thumbnail = uploadResult.secure_url;
  await course.save();

  res.json(new ApiResponse(200, course, 'Thumbnail updated'));
});

// PATCH /api/v1/courses/:id/publish
const publishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorised');
  }
  const transitions = { draft: 'review', review: 'published', published: 'published' };
  course.status = transitions[course.status] || course.status;
  await course.save();
  res.json(new ApiResponse(200, course, `Course status: ${course.status}`));
});

// POST /api/v1/courses/:id/sections
const addSection = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.instructor.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not authorised');

  const section = await Section.create({ title: req.body.title, course: course._id, order: course.curriculum.length });
  course.curriculum.push(section._id);
  await course.save();
  res.status(201).json(new ApiResponse(201, section, 'Section added'));
});

// POST /api/v1/courses/:id/sections/:sId/lessons
const addLesson = asyncHandler(async (req, res) => {
  const section = await Section.findById(req.params.sId);
  if (!section) throw new ApiError(404, 'Section not found');
  const lesson = await Lesson.create({
    ...req.body,
    section: section._id,
    course: req.params.id,
    order: section.lessons.length,
  });
  section.lessons.push(lesson._id);
  await section.save();
  // Update course total lessons + duration
  await Course.findByIdAndUpdate(req.params.id, {
    $inc: { totalLessons: 1, totalDuration: lesson.videoDuration || 0 },
  });
  res.status(201).json(new ApiResponse(201, lesson, 'Lesson added'));
});

// PUT /api/v1/courses/:id/curriculum
const syncCurriculum = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorised');
  }

  // Delete existing curriculum for this course
  await Section.deleteMany({ course: course._id });
  await Lesson.deleteMany({ course: course._id });
  
  const sections = req.body.curriculum; // Array of sections with lessons
  const newCurriculumIds = [];
  let totalLessons = 0;
  let totalDuration = 0;

  for (let i = 0; i < sections.length; i++) {
    const secData = sections[i];
    const section = await Section.create({ title: secData.title, course: course._id, order: i });
    const newLessonIds = [];
    
    for (let j = 0; j < secData.lessons.length; j++) {
      const lesData = secData.lessons[j];
      const lesson = await Lesson.create({
        ...lesData,
        section: section._id,
        course: course._id,
        order: j,
      });
      newLessonIds.push(lesson._id);
      totalLessons++;
      totalDuration += lesson.videoDuration || 0;
    }
    
    section.lessons = newLessonIds;
    await section.save();
    newCurriculumIds.push(section._id);
  }

  course.curriculum = newCurriculumIds;
  course.totalLessons = totalLessons;
  course.totalDuration = totalDuration;
  await course.save();

  res.json(new ApiResponse(200, course.curriculum, 'Curriculum synced successfully'));
});


// PATCH /api/v1/courses/:id/sections/:sId
const updateSection = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') throw new ApiError(403, 'Not authorised');

  const section = await Section.findByIdAndUpdate(req.params.sId, { title: req.body.title }, { new: true });
  if (!section) throw new ApiError(404, 'Section not found');
  res.json(new ApiResponse(200, section, 'Section updated'));
});

// DELETE /api/v1/courses/:id/sections/:sId
const deleteSection = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') throw new ApiError(403, 'Not authorised');

  const section = await Section.findByIdAndDelete(req.params.sId);
  if (!section) throw new ApiError(404, 'Section not found');
  
  // also delete lessons in this section
  await Lesson.deleteMany({ section: req.params.sId });
  
  course.curriculum = course.curriculum.filter(s => s.toString() !== req.params.sId);
  await course.save();

  res.json(new ApiResponse(200, {}, 'Section deleted'));
});

// PATCH /api/v1/courses/:id/sections/:sId/lessons/:lId
const updateLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') throw new ApiError(403, 'Not authorised');

  const lesson = await Lesson.findByIdAndUpdate(req.params.lId, req.body, { new: true });
  if (!lesson) throw new ApiError(404, 'Lesson not found');
  res.json(new ApiResponse(200, lesson, 'Lesson updated'));
});

// DELETE /api/v1/courses/:id/sections/:sId/lessons/:lId
const deleteLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') throw new ApiError(403, 'Not authorised');

  const lesson = await Lesson.findByIdAndDelete(req.params.lId);
  if (!lesson) throw new ApiError(404, 'Lesson not found');

  const section = await Section.findById(req.params.sId);
  if (section) {
    section.lessons = section.lessons.filter(l => l.toString() !== req.params.lId);
    await section.save();
  }

  await Course.findByIdAndUpdate(req.params.id, {
    $inc: { totalLessons: -1, totalDuration: -(lesson.videoDuration || 0) },
  });

  res.json(new ApiResponse(200, {}, 'Lesson deleted'));
});

// PATCH /api/v1/courses/:id/reorder
const reorderCurriculum = asyncHandler(async (req, res) => {
  const { sectionOrder, lessonOrders } = req.body;
  // sectionOrder: [{ id, order }]; lessonOrders: [{ sectionId, lessonId, order }]
  if (sectionOrder) {
    await Promise.all(sectionOrder.map(({ id, order }) => Section.findByIdAndUpdate(id, { order })));
  }
  if (lessonOrders) {
    await Promise.all(lessonOrders.map(({ lessonId, order }) => Lesson.findByIdAndUpdate(lessonId, { order })));
  }
  res.json(new ApiResponse(200, {}, 'Curriculum reordered'));
});

// GET /api/v1/courses/:id/analytics — Instructor
const getCourseAnalytics = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorised');
  }
  const enrollments = await Enrollment.find({ course: course._id });
  const completed = enrollments.filter((e) => e.isCompleted).length;
  const avgProgress = enrollments.length
    ? (enrollments.reduce((acc, e) => acc + e.progressPercent, 0) / enrollments.length).toFixed(1)
    : 0;
  res.json(new ApiResponse(200, {
    enrolledCount: course.enrolledCount,
    completionRate: enrollments.length ? ((completed / enrollments.length) * 100).toFixed(1) : 0,
    avgProgress,
    rating: course.rating,
    totalReviews: course.totalReviews,
  }));
});

// POST /api/v1/courses/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id });
  if (!enrollment) throw new ApiError(403, 'You must be enrolled to review this course');

  const existing = await Review.findOne({ user: req.user._id, course: req.params.id });
  if (existing) throw new ApiError(409, 'You have already reviewed this course');

  const review = await Review.create({ user: req.user._id, course: req.params.id, ...req.body });

  // Recalculate course rating
  const reviews = await Review.find({ course: req.params.id, isHidden: false });
  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  await Course.findByIdAndUpdate(req.params.id, { rating: avgRating, totalReviews: reviews.length });

  res.status(201).json(new ApiResponse(201, review, 'Review submitted'));
});

// GET /api/v1/courses/:id/reviews
const getReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { skip, limit: lim } = paginate(req.query, { page, limit });
  const [reviews, total] = await Promise.all([
    Review.find({ course: req.params.id, isHidden: false })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Review.countDocuments({ course: req.params.id, isHidden: false }),
  ]);
  res.json(new ApiResponse(200, reviews, 'Reviews fetched', paginationMeta(total, page, limit)));
});

// POST /api/v1/courses/:id/enroll (free courses)
const enrollFree = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (course.price > 0) throw new ApiError(400, 'This is a paid course. Use checkout.');

  const existing = await Enrollment.findOne({ user: req.user._id, course: course._id });
  if (existing) throw new ApiError(409, 'Already enrolled');

  await Enrollment.create({ user: req.user._id, course: course._id });
  await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });
  res.status(201).json(new ApiResponse(201, {}, 'Enrolled successfully'));
});

// PATCH /api/v1/courses/:id/lessons/:lessonId/progress
const markLessonComplete = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id });
  if (!enrollment) throw new ApiError(403, 'Not enrolled');

  if (!enrollment.completedLessons.includes(req.params.lessonId)) {
    enrollment.completedLessons.push(req.params.lessonId);
  }

  const course = await Course.findById(req.params.id);
  enrollment.progressPercent = Math.round((enrollment.completedLessons.length / course.totalLessons) * 100);
  enrollment.lastAccessedAt = Date.now();
  
  const wasCompleted = enrollment.isCompleted;
  if (enrollment.progressPercent === 100) {
    enrollment.isCompleted = true;
    enrollment.completedAt = Date.now();
  }
  await enrollment.save();

  // Generate certificate if just completed
  if (enrollment.isCompleted && !wasCompleted) {
    try {
      await enrollment.populate('user', 'name');
      await enrollment.populate('course', 'title');
      const certUrl = await certificateService.generateAndSaveCertificate(enrollment);
      enrollment.certificateUrl = certUrl;
      await enrollment.save();
    } catch (err) {
      logger.error('Certificate generation failed:', err);
    }
  }
  res.json(new ApiResponse(200, { 
    progressPercent: enrollment.progressPercent, 
    isCompleted: enrollment.isCompleted,
    certificateUrl: enrollment.certificateUrl 
  }));
});

// GET /api/v1/courses/stats — public
const getStats = asyncHandler(async (req, res) => {
  const [totalCourses, totalEnrollments, totalUsers, completedEnrollments, categoryStats] = await Promise.all([
    Course.countDocuments({ status: 'published' }),
    Enrollment.countDocuments(),
    User.countDocuments({ role: 'student' }),
    Enrollment.countDocuments({ isCompleted: true }),
    Course.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])
  ]);
  
  const categoryCounts = categoryStats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  res.json(new ApiResponse(200, {
    totalCourses,
    totalEnrollments,
    totalUsers,
    completedEnrollments,
    categoryCounts,
    avgCompletionRate: totalEnrollments ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
  }));
});

module.exports = { getCourses, getStats, createCourse, getCourseBySlug, getCourseById, updateCourse, deleteCourse, publishCourse, addSection, updateSection, deleteSection, addLesson, updateLesson, deleteLesson, syncCurriculum, reorderCurriculum, getCourseAnalytics, addReview, getReviews, enrollFree, markLessonComplete, updateCourseThumbnail };
