const Course = require('../models/Course');
const { Section, Lesson } = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const User = require('../models/User');
const { paginate, paginationMeta } = require('../utils/paginate');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const certificateService = require('./certificateService');
const redis = require('../config/redis');

const CACHE_TTL = 300;
const STATS_TTL = 60;

const cacheGet = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

const cacheSet = async (key, data, ttl = CACHE_TTL) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (_) { /* cache write failure is non-critical */ }
};

const cacheDel = async (key) => {
  try { await redis.del(key); } catch (_) { /* cache deletion failure is non-critical */ }
};

class CourseService {
  async getCourses(query, user = null) {
    const { search, category, level, priceMin = 0, priceMax = 999999, sort = '-createdAt', page = 1, limit = 12, isFeatured, instructor } = query;

    const cacheKey = user ? null : `courses:${JSON.stringify(query)}`;
    if (cacheKey && !search && !instructor) {
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;
    }

    const filter = { status: 'published' };
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (isFeatured) filter.isFeatured = true;
    filter.price = { $gte: Number(priceMin), $lte: Number(priceMax) };

    if (instructor === 'me' && user) {
      filter.instructor = user._id;
      delete filter.status;
    }

    const { skip, limit: lim } = paginate(query, { page, limit });
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('instructor', 'name avatar')
        .sort(sort)
        .skip(skip)
        .limit(lim)
        .select('-curriculum'),
      Course.countDocuments(filter),
    ]);
    const result = { courses, meta: paginationMeta(total, page, lim) };

    if (cacheKey) await cacheSet(cacheKey, result);
    return result;
  }

  async getCourseBySlug(slug, user = null) {
    const cacheKey = `course:${slug}`;
    const cached = user ? null : await cacheGet(cacheKey);
    if (cached) {
      let isEnrolled = false;
      if (user) {
        isEnrolled = !!(await Enrollment.findOne({ user: user._id, course: cached._id }));
      }
      return { ...cached, isEnrolled };
    }

    const course = await Course.findOne({ slug, status: 'published' })
      .populate('instructor', 'name avatar bio')
      .populate({
        path: 'curriculum',
        model: 'Section',
        populate: { path: 'lessons', model: 'Lesson', select: 'title type duration isPreview order videoDuration' },
      });
    if (!course) throw new ApiError(404, 'Course not found');

    let isEnrolled = false;
    if (user) {
      isEnrolled = !!(await Enrollment.findOne({ user: user._id, course: course._id }));
    }
    const result = { ...course.toObject(), isEnrolled };

    if (!user) await cacheSet(cacheKey, result);
    return result;
  }

  async createCourse(data, instructorId) {
    return Course.create({ ...data, instructor: instructorId, status: 'draft' });
  }

  async getCourseById(courseId, user) {
    const course = await Course.findById(courseId)
      .populate('instructor', 'name avatar')
      .populate({
        path: 'curriculum',
        model: 'Section',
        populate: { path: 'lessons', model: 'Lesson' },
      });
    if (!course) throw new ApiError(404, 'Course not found');
    if (user.role !== 'admin' && course.instructor.toString() !== user._id.toString()) {
      throw new ApiError(403, 'Not authorised');
    }
    return course;
  }

  async updateCourse(courseId, user, updateData) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (user.role !== 'admin' && course.instructor.toString() !== user._id.toString()) {
      throw new ApiError(403, 'Not authorised');
    }
    const allowed = ['title', 'description', 'shortDescription', 'thumbnail', 'previewVideo', 'category', 'tags', 'level', 'language', 'price', 'originalPrice', 'requirements', 'outcomes', 'certificate'];
    allowed.forEach((f) => { if (updateData[f] !== undefined) course[f] = updateData[f]; });
    await course.save();

    await cacheDel(`course:${course.slug}`);
    await cacheDel('stats:public');
    return course;
  }

  async deleteCourse(courseId, user) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (user.role !== 'admin' && course.instructor.toString() !== user._id.toString()) {
      throw new ApiError(403, 'Not authorised');
    }
    course.status = 'archived';
    await course.save();
    return {};
  }

  async publishCourse(courseId, user) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.instructor.toString() !== user._id.toString() && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorised');
    }
    const transitions = { draft: 'review', review: 'published', published: 'published' };
    course.status = transitions[course.status] || course.status;
    await course.save();
    return course;
  }

  async addSection(courseId, user, title) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.instructor.toString() !== user._id.toString()) throw new ApiError(403, 'Not authorised');

    const section = await Section.create({ title, course: course._id, order: course.curriculum.length });
    course.curriculum.push(section._id);
    await course.save();
    return section;
  }

  async updateSection(courseId, user, sectionId, title) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.instructor.toString() !== user._id.toString() && user.role !== 'admin') throw new ApiError(403, 'Not authorised');

    const section = await Section.findByIdAndUpdate(sectionId, { title }, { new: true });
    if (!section) throw new ApiError(404, 'Section not found');
    return section;
  }

  async deleteSection(courseId, user, sectionId) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.instructor.toString() !== user._id.toString() && user.role !== 'admin') throw new ApiError(403, 'Not authorised');

    const section = await Section.findByIdAndDelete(sectionId);
    if (!section) throw new ApiError(404, 'Section not found');

    await Lesson.deleteMany({ section: sectionId });
    course.curriculum = course.curriculum.filter(s => s.toString() !== sectionId);
    await course.save();
    return {};
  }

  async addLesson(courseId, sectionId, user, lessonData) {
    const section = await Section.findById(sectionId);
    if (!section) throw new ApiError(404, 'Section not found');

    const lesson = await Lesson.create({
      ...lessonData,
      section: section._id,
      course: courseId,
      order: section.lessons.length,
    });
    section.lessons.push(lesson._id);
    await section.save();
    await Course.findByIdAndUpdate(courseId, {
      $inc: { totalLessons: 1, totalDuration: lesson.videoDuration || 0 },
    });
    return lesson;
  }

  async updateLesson(courseId, user, lessonId, updateData) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.instructor.toString() !== user._id.toString() && user.role !== 'admin') throw new ApiError(403, 'Not authorised');

    const lesson = await Lesson.findByIdAndUpdate(lessonId, updateData, { new: true });
    if (!lesson) throw new ApiError(404, 'Lesson not found');
    return lesson;
  }

  async deleteLesson(courseId, sectionId, user, lessonId) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.instructor.toString() !== user._id.toString() && user.role !== 'admin') throw new ApiError(403, 'Not authorised');

    const lesson = await Lesson.findByIdAndDelete(lessonId);
    if (!lesson) throw new ApiError(404, 'Lesson not found');

    const section = await Section.findById(sectionId);
    if (section) {
      section.lessons = section.lessons.filter(l => l.toString() !== lessonId);
      await section.save();
    }

    await Course.findByIdAndUpdate(courseId, {
      $inc: { totalLessons: -1, totalDuration: -(lesson.videoDuration || 0) },
    });
    return {};
  }

  async syncCurriculum(courseId, user, curriculum) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.instructor.toString() !== user._id.toString() && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorised');
    }

    const existingSections = await Section.find({ course: course._id }).populate('lessons');
    const existingLessons = await Lesson.find({ course: course._id });
    const existingLessonMap = new Map(existingLessons.map(l => [l._id.toString(), l]));
    const existingSectionMap = new Map(existingSections.map(s => [s._id.toString(), s]));

    const usedSectionIds = new Set();
    const usedLessonIds = new Set();
    const newCurriculumIds = [];
    let totalLessons = 0;
    let totalDuration = 0;

    for (let i = 0; i < curriculum.length; i++) {
      const secData = curriculum[i];
      let section;

      if (secData._id && existingSectionMap.has(secData._id)) {
        section = await Section.findByIdAndUpdate(
          secData._id,
          { title: secData.title, order: i },
          { new: true }
        );
      } else {
        section = await Section.create({ title: secData.title, course: course._id, order: i });
      }

      usedSectionIds.add(section._id.toString());

      const newLessonIds = [];
      for (let j = 0; j < secData.lessons.length; j++) {
        const lesData = secData.lessons[j];
        let lesson;

        if (lesData._id && existingLessonMap.has(lesData._id)) {
          const updates = { ...lesData };
          delete updates._id;
          lesson = await Lesson.findByIdAndUpdate(lesData._id, { ...updates, order: j }, { new: true });
        } else {
          lesson = await Lesson.create({
            ...lesData,
            section: section._id,
            course: course._id,
            order: j,
          });
        }

        newLessonIds.push(lesson._id);
        usedLessonIds.add(lesson._id.toString());
        totalLessons++;
        totalDuration += lesson.videoDuration || 0;
      }

      section.lessons = newLessonIds;
      await section.save();
      newCurriculumIds.push(section._id);
    }

    const sectionsToDelete = existingSections
      .filter(s => !usedSectionIds.has(s._id.toString()))
      .map(s => s._id);
    if (sectionsToDelete.length > 0) {
      const lessonsToDelete = existingLessons
        .filter(l => l.section && sectionsToDelete.includes(l.section.toString()))
        .map(l => l._id);
      if (lessonsToDelete.length > 0) {
        await Lesson.deleteMany({ _id: { $in: lessonsToDelete } });
      }
      await Section.deleteMany({ _id: { $in: sectionsToDelete } });
    }

    course.curriculum = newCurriculumIds;
    course.totalLessons = totalLessons;
    course.totalDuration = totalDuration;
    await course.save();

    return course.curriculum;
  }

  async reorderCurriculum(sectionOrder, lessonOrders) {
    if (sectionOrder) {
      await Promise.all(sectionOrder.map(({ id, order }) => Section.findByIdAndUpdate(id, { order })));
    }
    if (lessonOrders) {
      await Promise.all(lessonOrders.map(({ lessonId, order }) => Lesson.findByIdAndUpdate(lessonId, { order })));
    }
    return {};
  }

  async getCourseAnalytics(courseId, user) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.instructor.toString() !== user._id.toString() && user.role !== 'admin') {
      throw new ApiError(403, 'Not authorised');
    }
    const enrollments = await Enrollment.find({ course: course._id });
    const completed = enrollments.filter((e) => e.isCompleted).length;
    const avgProgress = enrollments.length
      ? (enrollments.reduce((acc, e) => acc + e.progressPercent, 0) / enrollments.length).toFixed(1)
      : 0;
    return {
      enrolledCount: course.enrolledCount,
      completionRate: enrollments.length ? ((completed / enrollments.length) * 100).toFixed(1) : 0,
      avgProgress,
      rating: course.rating,
      totalReviews: course.totalReviews,
    };
  }

  async addReview(userId, courseId, reviewData) {
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) throw new ApiError(403, 'You must be enrolled to review this course');

    const existing = await Review.findOne({ user: userId, course: courseId });
    if (existing) throw new ApiError(409, 'You have already reviewed this course');

    const review = await Review.create({ user: userId, course: courseId, ...reviewData });

    const reviews = await Review.find({ course: courseId, isHidden: false });
    const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
    await Course.findByIdAndUpdate(courseId, { rating: avgRating, totalReviews: reviews.length });

    return review;
  }

  async getReviews(courseId, query) {
    const { page = 1, limit = 10 } = query;
    const { skip, limit: lim } = paginate(query, { page, limit });
    const [reviews, total] = await Promise.all([
      Review.find({ course: courseId, isHidden: false })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim),
      Review.countDocuments({ course: courseId, isHidden: false }),
    ]);
    return { reviews, meta: paginationMeta(total, page, limit) };
  }

  async enrollFree(userId, courseId) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.price > 0) throw new ApiError(400, 'This is a paid course. Use checkout.');

    const existing = await Enrollment.findOne({ user: userId, course: course._id });
    if (existing) throw new ApiError(409, 'Already enrolled');

    await Enrollment.create({ user: userId, course: course._id });
    await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });
    return {};
  }

  async markLessonComplete(userId, courseId, lessonId) {
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) throw new ApiError(403, 'Not enrolled');

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const course = await Course.findById(courseId);
    enrollment.progressPercent = Math.round((enrollment.completedLessons.length / course.totalLessons) * 100);
    enrollment.lastAccessedAt = Date.now();

    const wasCompleted = enrollment.isCompleted;
    if (enrollment.progressPercent === 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = Date.now();
    }
    await enrollment.save();

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

    return {
      progressPercent: enrollment.progressPercent,
      isCompleted: enrollment.isCompleted,
      certificateUrl: enrollment.certificateUrl
    };
  }

  async getStats() {
    const cached = await cacheGet('stats:public');
    if (cached) return cached;

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

    const result = {
      totalCourses,
      totalEnrollments,
      totalUsers,
      completedEnrollments,
      categoryCounts,
      avgCompletionRate: totalEnrollments ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
    };

    await cacheSet('stats:public', result, STATS_TTL);
    return result;
  }
}

module.exports = new CourseService();