const rateLimit = require('express-rate-limit');
const redis = require('../config/redis');

// Generic limiter factory
const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
    // Use redis store if available, else memory
    ...(redis.set && redis.incr
      ? {
          store: {
            init: () => {},
            increment: async (key) => {
              const current = await redis.incr(`rl:${key}`);
              if (current === 1) await redis.expire(`rl:${key}`, Math.ceil(windowMs / 1000));
              return { totalHits: current, resetTime: new Date(Date.now() + windowMs) };
            },
            decrement: async (key) => {
              await redis.decr?.(`rl:${key}`);
            },
            resetKey: async (key) => {
              await redis.del(`rl:${key}`);
            },
          },
        }
      : {}),
  });

const authLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  'Too many auth attempts. Please try again in 15 minutes.'
);

const apiLimiter = createLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  parseInt(process.env.RATE_LIMIT_MAX) || 100,
  'Too many requests. Please slow down.'
);

const checkoutLimiter = createLimiter(
  60 * 60 * 1000,
  10,
  'Too many checkout attempts. Please try again later.'
);

module.exports = { authLimiter, apiLimiter, checkoutLimiter };
