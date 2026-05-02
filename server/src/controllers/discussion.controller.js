const Discussion = require('../models/Discussion');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { paginate, paginationMeta } = require('../utils/paginate');

// GET /api/v1/courses/:courseId/discussions or GET /api/v1/courses/community/discussions (global)
const getDiscussions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, lessonId, search, tag } = req.query;
  const filter = {};
  
  if (req.params.courseId && req.params.courseId !== 'community') {
    filter.course = req.params.courseId;
  } else {
    // Global community feed: only root posts (no parent) and not tied to a course? 
    // Or just all root posts. Let's say all root posts.
    filter.parent = null;
  }
  
  if (lessonId) filter.lesson = lessonId;
  if (tag) filter.tags = tag.toLowerCase();
  if (search) filter.$text = { $search: search };
  
  const { skip, limit: lim } = paginate(req.query, { page, limit });
  const [discussions, total] = await Promise.all([
    Discussion.find(filter)
      .populate('user', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Discussion.countDocuments(filter),
  ]);
  res.json(new ApiResponse(200, discussions, 'Discussions fetched', paginationMeta(total, page, limit)));
});

// GET /api/v1/courses/discussions/:id/replies
const getDiscussionReplies = asyncHandler(async (req, res) => {
  const replies = await Discussion.find({ parent: req.params.id })
    .populate('user', 'name avatar role')
    .sort({ createdAt: 1 });
  res.json(new ApiResponse(200, replies, 'Replies fetched'));
});

// POST /api/v1/courses/:courseId/discussions or POST /api/v1/courses/community/discussions
const createDiscussion = asyncHandler(async (req, res) => {
  const isGlobal = req.params.courseId === 'community';
  
  const discussion = await Discussion.create({
    user: req.user._id,
    course: isGlobal ? null : req.params.courseId,
    lesson: req.body.lessonId || null,
    parent: req.body.parentId || null,
    title: req.body.title || null,
    content: req.body.content,
    tags: req.body.tags || [],
  });
  await discussion.populate('user', 'name avatar role');
  res.status(201).json(new ApiResponse(201, discussion, 'Discussion created'));
});

// POST /api/v1/courses/discussions/:id/upvote (made courseId optional in route)
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

module.exports = { getDiscussions, getDiscussionReplies, createDiscussion, toggleUpvote, resolveDiscussion, getInstructorDiscussions };