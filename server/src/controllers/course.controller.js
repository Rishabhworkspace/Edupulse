const courseService = require('../services/courseService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const cloudinary = require('../config/cloudinary');

const getCourses = async (req, res) => {
  const result = await courseService.getCourses(req.query, req.user);
  res.json(new ApiResponse(200, result.courses, 'Courses fetched', result.meta));
};

const createCourse = async (req, res) => {
  const course = await courseService.createCourse(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, course, 'Course created'));
};

const getCourseBySlug = async (req, res) => {
  const course = await courseService.getCourseBySlug(req.params.slug, req.user);
  res.json(new ApiResponse(200, course));
};

const getCourseById = async (req, res) => {
  const course = await courseService.getCourseById(req.params.id, req.user);
  res.json(new ApiResponse(200, course));
};

const updateCourse = async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.user, req.body);
  res.json(new ApiResponse(200, course, 'Course updated'));
};

const deleteCourse = async (req, res) => {
  await courseService.deleteCourse(req.params.id, req.user);
  res.json(new ApiResponse(200, {}, 'Course archived'));
};

const updateCourseThumbnail = async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file provided');
  const course = await courseService.getCourseById(req.params.id, req.user);

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

  const updated = await courseService.updateCourse(req.params.id, req.user, { thumbnail: uploadResult.secure_url });
  res.json(new ApiResponse(200, updated, 'Thumbnail updated'));
};

const publishCourse = async (req, res) => {
  const course = await courseService.publishCourse(req.params.id, req.user);
  res.json(new ApiResponse(200, course, `Course status: ${course.status}`));
};

const addSection = async (req, res) => {
  const section = await courseService.addSection(req.params.id, req.user, req.body.title);
  res.status(201).json(new ApiResponse(201, section, 'Section added'));
};

const updateSection = async (req, res) => {
  const section = await courseService.updateSection(req.params.id, req.user, req.params.sId, req.body.title);
  res.json(new ApiResponse(200, section, 'Section updated'));
};

const deleteSection = async (req, res) => {
  await courseService.deleteSection(req.params.id, req.user, req.params.sId);
  res.json(new ApiResponse(200, {}, 'Section deleted'));
};

const addLesson = async (req, res) => {
  const lesson = await courseService.addLesson(req.params.id, req.params.sId, req.user, req.body);
  res.status(201).json(new ApiResponse(201, lesson, 'Lesson added'));
};

const updateLesson = async (req, res) => {
  const lesson = await courseService.updateLesson(req.params.id, req.user, req.params.lId, req.body);
  res.json(new ApiResponse(200, lesson, 'Lesson updated'));
};

const deleteLesson = async (req, res) => {
  await courseService.deleteLesson(req.params.id, req.params.sId, req.user, req.params.lId);
  res.json(new ApiResponse(200, {}, 'Lesson deleted'));
};

const syncCurriculum = async (req, res) => {
  const curriculum = await courseService.syncCurriculum(req.params.id, req.user, req.body.curriculum);
  res.json(new ApiResponse(200, curriculum, 'Curriculum synced successfully'));
};

const reorderCurriculum = async (req, res) => {
  const { sectionOrder, lessonOrders } = req.body;
  await courseService.reorderCurriculum(sectionOrder, lessonOrders);
  res.json(new ApiResponse(200, {}, 'Curriculum reordered'));
};

const getCourseAnalytics = async (req, res) => {
  const analytics = await courseService.getCourseAnalytics(req.params.id, req.user);
  res.json(new ApiResponse(200, analytics));
};

const addReview = async (req, res) => {
  const review = await courseService.addReview(req.user._id, req.params.id, req.body);
  res.status(201).json(new ApiResponse(201, review, 'Review submitted'));
};

const getReviews = async (req, res) => {
  const result = await courseService.getReviews(req.params.id, req.query);
  res.json(new ApiResponse(200, result.reviews, 'Reviews fetched', result.meta));
};

const enrollFree = async (req, res) => {
  await courseService.enrollFree(req.user._id, req.params.id);
  res.status(201).json(new ApiResponse(201, {}, 'Enrolled successfully'));
};

const markLessonComplete = async (req, res) => {
  const result = await courseService.markLessonComplete(req.user._id, req.params.id, req.params.lessonId);
  res.json(new ApiResponse(200, result));
};

const getStats = async (req, res) => {
  const stats = await courseService.getStats();
  res.json(new ApiResponse(200, stats));
};

module.exports = {
  getCourses, getStats, createCourse, getCourseBySlug, getCourseById,
  updateCourse, deleteCourse, publishCourse, addSection, updateSection,
  deleteSection, addLesson, updateLesson, deleteLesson, syncCurriculum,
  reorderCurriculum, getCourseAnalytics, addReview, getReviews, enrollFree,
  markLessonComplete, updateCourseThumbnail
};