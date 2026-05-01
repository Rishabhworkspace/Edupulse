const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { paginate, paginationMeta } = require('../utils/paginate');

// GET /api/v1/users/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'title thumbnail slug price');
  res.json(new ApiResponse(200, user));
});

// PATCH /api/v1/users/me
const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'socialLinks', 'skills', 'avatar'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json(new ApiResponse(200, user, 'Profile updated'));
});

// PATCH /api/v1/users/me/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!await user.comparePassword(currentPassword)) throw new ApiError(400, 'Current password is incorrect');
  user.password = newPassword;
  await user.save();
  res.json(new ApiResponse(200, {}, 'Password changed successfully'));
});

// GET /api/v1/users — Admin only
const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role, isBanned } = req.query;
  const filter = {};
  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
  if (role) filter.role = role;
  if (isBanned !== undefined) filter.isBanned = isBanned === 'true';

  const { skip, limit: lim } = paginate(req.query, { page, limit });
  const [users, total] = await Promise.all([
    User.find(filter).select('-refreshToken').sort({ createdAt: -1 }).skip(skip).limit(lim),
    User.countDocuments(filter),
  ]);

  res.json(new ApiResponse(200, users, 'Users fetched', paginationMeta(total, page, limit)));
});

// GET /api/v1/users/:id — Admin only
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  res.json(new ApiResponse(200, user));
});

// PATCH /api/v1/users/:id/ban — Admin only
const banUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) throw new ApiError(400, 'Cannot ban yourself');
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBanned: req.body.isBanned ?? true, $unset: { refreshToken: '' } },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  res.json(new ApiResponse(200, user, `User ${user.isBanned ? 'banned' : 'unbanned'}`));
});

// PATCH /api/v1/users/:id/role — Admin only
const promoteRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['student', 'instructor', 'admin'].includes(role)) throw new ApiError(400, 'Invalid role');
  if (req.params.id === req.user._id.toString()) throw new ApiError(400, 'Cannot change your own role');
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  res.json(new ApiResponse(200, user, `Role updated to ${role}`));
});

// DELETE /api/v1/users/:id — Admin only
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) throw new ApiError(400, 'Cannot delete yourself');
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(new ApiResponse(200, {}, 'User deleted'));
});

// GET /api/v1/users/me/enrollments  or  GET /api/v1/users/:id/enrollments
const getUserEnrollments = asyncHandler(async (req, res) => {
  // Support both /me/enrollments and /:id/enrollments
  const rawId = req.params.id || 'me';
  const userId = rawId === 'me' ? req.user._id : rawId;

  // Non-admins can only view their own enrollments
  if (req.user.role !== 'admin' && userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorised');
  }

  const enrollments = await Enrollment.find({ user: userId })
    .populate('course', 'title thumbnail rating price slug totalLessons')
    .sort({ lastAccessedAt: -1 });

  res.json(new ApiResponse(200, enrollments));
});

// PATCH /api/v1/users/me/avatar
const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file provided');
  
  const cloudinary = require('../config/cloudinary');
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'avatars', public_id: `user_${req.user._id}_${Date.now()}` },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: uploadResult.secure_url },
    { new: true, runValidators: true }
  ).populate('wishlist', 'title thumbnail slug price');

  res.json(new ApiResponse(200, user, 'Avatar updated'));
});

// PATCH /api/v1/users/me/wishlist/:courseId
const toggleWishlist = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const user = await User.findById(req.user._id);
  
  const isWishlisted = user.wishlist.includes(courseId);
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    isWishlisted ? { $pull: { wishlist: courseId } } : { $addToSet: { wishlist: courseId } },
    { new: true }
  ).populate('wishlist', 'title thumbnail slug price');
  
  res.json(new ApiResponse(200, updatedUser, isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'));
});

module.exports = { getMe, updateMe, changePassword, updateAvatar, listUsers, getUserById, banUser, promoteRole, deleteUser, getUserEnrollments, toggleWishlist };
