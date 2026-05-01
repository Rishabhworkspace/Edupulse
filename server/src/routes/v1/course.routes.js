const router = require('express').Router();
const c = require('../../controllers/course.controller');
const d = require('../../controllers/discussion.controller');
const { verifyJWT, authorise, optionalAuth } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// Public routes
router.get('/', optionalAuth, c.getCourses);
router.get('/stats', c.getStats);
router.get('/:slug', optionalAuth, c.getCourseBySlug);
router.get('/:id/reviews', c.getReviews);
router.get('/:id/discussions', d.getDiscussions);

// Student routes
router.post('/:id/reviews', verifyJWT, authorise('student'), c.addReview);
router.post('/:id/enroll', verifyJWT, authorise('student'), c.enrollFree);
router.patch('/:courseId/lessons/:lessonId/progress', verifyJWT, c.markLessonComplete);
router.post('/:id/discussions', verifyJWT, authorise('student', 'instructor'), d.createDiscussion);
router.post('/:courseId/discussions/:id/upvote', verifyJWT, d.toggleUpvote);
router.patch('/:courseId/discussions/:id/resolve', verifyJWT, d.resolveDiscussion);

// Instructor routes
router.post('/', verifyJWT, authorise('instructor', 'admin'), c.createCourse);
router.get('/:id/edit', verifyJWT, authorise('instructor', 'admin'), c.getCourseById);
router.patch('/:id', verifyJWT, authorise('instructor', 'admin'), c.updateCourse);
router.patch('/:id/thumbnail', verifyJWT, authorise('instructor', 'admin'), upload.single('thumbnail'), c.updateCourseThumbnail);
router.delete('/:id', verifyJWT, authorise('instructor', 'admin'), c.deleteCourse);
router.patch('/:id/publish', verifyJWT, authorise('instructor', 'admin'), c.publishCourse);
router.put('/:id/curriculum', verifyJWT, authorise('instructor', 'admin'), c.syncCurriculum);
router.post('/:id/sections', verifyJWT, authorise('instructor', 'admin'), c.addSection);
router.patch('/:id/sections/:sId', verifyJWT, authorise('instructor', 'admin'), c.updateSection);
router.delete('/:id/sections/:sId', verifyJWT, authorise('instructor', 'admin'), c.deleteSection);
router.post('/:id/sections/:sId/lessons', verifyJWT, authorise('instructor', 'admin'), c.addLesson);
router.patch('/:id/sections/:sId/lessons/:lId', verifyJWT, authorise('instructor', 'admin'), c.updateLesson);
router.delete('/:id/sections/:sId/lessons/:lId', verifyJWT, authorise('instructor', 'admin'), c.deleteLesson);
router.patch('/:id/reorder', verifyJWT, authorise('instructor', 'admin'), c.reorderCurriculum);
router.get('/:id/analytics', verifyJWT, authorise('instructor', 'admin'), c.getCourseAnalytics);

// Instructor: Get all discussions from all their courses
router.get('/instructor/discussions', verifyJWT, authorise('instructor', 'admin'), d.getInstructorDiscussions);

module.exports = router;
