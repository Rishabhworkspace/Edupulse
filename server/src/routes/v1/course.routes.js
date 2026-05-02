const router = require('express').Router();
const c = require('../../controllers/course.controller');
const d = require('../../controllers/discussion.controller');
const { verifyJWT, authorise, optionalAuth } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const { validate } = require('../../middleware/validate');
const courseValidator = require('../../validators/course.validator');

const v = courseValidator;

router.get('/', optionalAuth, c.getCourses);
router.get('/stats', c.getStats);
router.get('/instructor/discussions', verifyJWT, authorise('instructor', 'admin'), d.getInstructorDiscussions);
router.get('/discussions/:id/replies', d.getDiscussionReplies);
router.post('/discussions/:id/upvote', verifyJWT, d.toggleUpvote);
router.get('/:courseId/discussions', optionalAuth, d.getDiscussions);
router.get('/:slug', optionalAuth, c.getCourseBySlug);
router.get('/:id/reviews', c.getReviews);

router.post('/:id/reviews', verifyJWT, authorise('student'), validate(v.reviewSchema), c.addReview);
router.post('/:id/enroll', verifyJWT, authorise('student'), c.enrollFree);
router.get('/:id/enrollment', verifyJWT, c.getEnrollment);
router.patch('/:id/lessons/:lessonId/notes', verifyJWT, c.saveNote);
router.patch('/:courseId/lessons/:lessonId/progress', verifyJWT, c.markLessonComplete);
router.post('/:courseId/discussions', verifyJWT, authorise('student', 'instructor'), d.createDiscussion);
router.patch('/:courseId/discussions/:id/resolve', verifyJWT, d.resolveDiscussion);

router.post('/', verifyJWT, authorise('instructor', 'admin'), validate(v.createCourseSchema), c.createCourse);
router.get('/:id/edit', verifyJWT, authorise('instructor', 'admin'), c.getCourseById);
router.patch('/:id', verifyJWT, authorise('instructor', 'admin'), validate(v.updateCourseSchema), c.updateCourse);
router.patch('/:id/thumbnail', verifyJWT, authorise('instructor', 'admin'), upload.single('thumbnail'), c.updateCourseThumbnail);
router.delete('/:id', verifyJWT, authorise('instructor', 'admin'), c.deleteCourse);
router.patch('/:id/publish', verifyJWT, authorise('instructor', 'admin'), c.publishCourse);
router.put('/:id/curriculum', verifyJWT, authorise('instructor', 'admin'), validate(v.syncCurriculumSchema), c.syncCurriculum);
router.post('/:id/sections', verifyJWT, authorise('instructor', 'admin'), validate(v.addSectionSchema), c.addSection);
router.patch('/:id/sections/:sId', verifyJWT, authorise('instructor', 'admin'), validate(v.addSectionSchema), c.updateSection);
router.delete('/:id/sections/:sId', verifyJWT, authorise('instructor', 'admin'), c.deleteSection);
router.post('/:id/sections/:sId/lessons', verifyJWT, authorise('instructor', 'admin'), validate(v.addLessonSchema), c.addLesson);
router.patch('/:id/sections/:sId/lessons/:lId', verifyJWT, authorise('instructor', 'admin'), validate(v.updateLessonSchema), c.updateLesson);
router.delete('/:id/sections/:sId/lessons/:lId', verifyJWT, authorise('instructor', 'admin'), c.deleteLesson);
router.patch('/:id/reorder', verifyJWT, authorise('instructor', 'admin'), validate(v.reorderSchema), c.reorderCurriculum);
router.get('/:id/analytics', verifyJWT, authorise('instructor', 'admin'), c.getCourseAnalytics);

module.exports = router;