const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/generateToken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Verify JWT and attach user to req
const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

  if (!token) throw new ApiError(401, 'No access token provided');

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired access token');
  }

  const user = await User.findById(decoded.id).select('-password -refreshToken');
  if (!user) throw new ApiError(401, 'User not found');
  if (user.isBanned) throw new ApiError(403, 'Account suspended. Contact support.');

  req.user = user;
  next();
});

// Role-based access control factory
const authorise = (...roles) =>
  (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Not authenticated'));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role '${req.user.role}' is not authorised for this action`));
    }
    next();
  };

// Optional auth — attaches user if token present, does not throw
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (!token) return next();
  try {
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
  } catch {
    // silently ignore
  }
  next();
});

module.exports = { verifyJWT, authorise, optionalAuth };
