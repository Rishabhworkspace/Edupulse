require('dotenv').config();
const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const emailService = require('../services/emailService');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already registered');

  const otp = generateOTP();
  const user = await User.create({
    name,
    email,
    password,
    emailVerifyToken: crypto.createHash('sha256').update(otp).digest('hex'),
    emailVerifyExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  await emailService.sendVerificationEmail(user.email, user.name, otp);

  res.status(201).json(
    new ApiResponse(201, { _id: user._id, name: user.name, email: user.email, role: user.role },
      'Registration successful. Please verify your email.')
  );
});

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !user.password) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');
  if (user.isBanned) throw new ApiError(403, 'Account suspended. Contact support.');
  if (!user.isVerified) throw new ApiError(403, 'Please verify your email first');

  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.json(new ApiResponse(200, { accessToken, user }, 'Login successful'));
});

// POST /api/v1/auth/logout
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: '' } });
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.json(new ApiResponse(200, {}, 'Logged out successfully'));
});

// POST /api/v1/auth/refresh-token
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, 'No refresh token');

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) throw new ApiError(401, 'Token mismatch');

  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const newRefresh = generateRefreshToken(payload);
  user.refreshToken = newRefresh;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', newRefresh, COOKIE_OPTIONS);
  res.json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
});

// POST /api/v1/auth/verify-email
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const hashed = crypto.createHash('sha256').update(otp).digest('hex');
  const user = await User.findOne({
    email,
    emailVerifyToken: hashed,
    emailVerifyExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, 'Invalid or expired OTP');

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.json(new ApiResponse(200, {}, 'Email verified successfully'));
});

// POST /api/v1/auth/resend-verification
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No account with that email');
  if (user.isVerified) throw new ApiError(400, 'Email already verified');

  // Rate Limiting: Enforce 2-minute cooldown
  if (user.emailVerifyExpires) {
    const timeSinceLastOtp = (10 * 60 * 1000) - (user.emailVerifyExpires - Date.now());
    if (timeSinceLastOtp < 2 * 60 * 1000) {
      throw new ApiError(429, 'Please wait 2 minutes before requesting a new OTP.');
    }
  }

  const otp = generateOTP();
  user.emailVerifyToken = crypto.createHash('sha256').update(otp).digest('hex');
  user.emailVerifyExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  await emailService.sendVerificationEmail(user.email, user.name, otp);

  res.json(new ApiResponse(200, {}, 'Verification OTP sent'));
});

// POST /api/v1/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError(404, 'No account with that email');

  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  await emailService.sendPasswordResetEmail(user.email, user.name, token);
  res.json(new ApiResponse(200, {}, 'Password reset link sent to your email'));
});

// PATCH /api/v1/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  res.json(new ApiResponse(200, {}, 'Password reset successful. Please login.'));
});

// POST /api/v1/auth/oauth/google — handled by Passport; this is the callback
const oauthCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshTokenVal = generateRefreshToken(payload);
  user.refreshToken = refreshTokenVal;
  await user.save({ validateBeforeSave: false });
  res.cookie('refreshToken', refreshTokenVal, COOKIE_OPTIONS);
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`);
});

module.exports = { register, login, logout, refreshToken, verifyEmail, resendVerification, forgotPassword, resetPassword, oauthCallback };
