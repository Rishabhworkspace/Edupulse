const Discussion = require('../models/Discussion');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { paginate, paginationMeta } = require('../utils/paginate');

// GET /api/v1/courses/:courseId/discussions
const getDiscussions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, lessonId } = req.query;
  const filter = { course: req.params.courseId };
  if (lessonId) filter.lesson = lessonId;
  
  const { skip, limit: lim } = paginate(req.query, { page, limit });
  const [discussions, total] = await Promise.all([
    Discussion.find(filter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Discussion.countDocuments(filter),
  ]);
  res.json(new ApiResponse(200, discussions, 'Discussions fetched', paginationMeta(total, page, limit)));
});

// POST /api/v1/courses/:courseId/discussions
const createDiscussion = asyncHandler(async (req, res) => {
  const discussion = await Discussion.create({
    user: req.user._id,
    course: req.params.courseId,
    lesson: req.body.lessonId || null,
    parent: req.body.parentId || null,
    content: req.body.content,
  });
  await discussion.populate('user', 'name avatar');
  res.status(201).json(new ApiResponse(201, discussion, 'Discussion created'));
});

// POST /api/v1/courses/:courseId/discussions/:id/upvote
const toggleUpvote = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id);
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  
  const userId = req.user._id.toString();
  const idx = discussion.upvotes.findIndex((u) => u.toString() === userId);
  
  if (idx > -1) {
    discussion.upvotes.splice(idx, 1);
  } else {
    discussion.upvotes.push(req.user._id);
  }
  await discussion.save();
  res.json(new ApiResponse(200, { upvotes: discussion.upvotes.length, upvoted: idx === -1 }));
});

// PATCH /api/v1/courses/:courseId/discussions/:id/resolve
const resolveDiscussion = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id).populate('course', 'instructor');
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  const isAuthor = discussion.user.toString() === req.user._id.toString();
  const isCourseInstructor = discussion.course?.instructor?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isAuthor && !isCourseInstructor && !isAdmin) {
    throw new ApiError(403, 'Only the question author, course instructor, or admin can resolve this');
  }
  discussion.isResolved = true;
  await discussion.save();
  res.json(new ApiResponse(200, discussion, 'Discussion resolved'));
});

// GET /api/v1/courses/instructor/discussions - Get all discussions for instructor's courses
const getInstructorDiscussions = asyncHandler(async (req, res) => {
  const Course = require('../models/Course');
  const { page = 1, limit = 20, status } = req.query;
  const { skip, limit: lim } = paginate(req.query, { page, limit });
  
  const instructorCourses = await Course.find({ instructor: req.user._id }).select('_id');
  const courseIds = instructorCourses.map(c => c._id);
  
  const filter = { course: { $in: courseIds } };
  if (status === 'resolved') filter.isResolved = true;
  if (status === 'unresolved') filter.isResolved = false;
  
  const [discussions, total] = await Promise.all([
    Discussion.find(filter)
      .populate('user', 'name avatar')
      .populate({
        path: 'course',
        select: 'title slug'
      })
      .populate({
        path: 'lesson',
        select: 'title'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Discussion.countDocuments(filter),
  ]);
  
  res.json(new ApiResponse(200, discussions, 'Discussions fetched', paginationMeta(total, page, limit)));
});

module.exports = { getDiscussions, createDiscussion, toggleUpvote, resolveDiscussion, getInstructorDiscussions };