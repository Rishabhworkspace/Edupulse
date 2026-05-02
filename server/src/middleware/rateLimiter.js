const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const redis = require('../config/redis');

// Generic limiter factory
const createLimiter = (windowMs, max, message) => {
  const options = {
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  };

  // Use redis store if available, else memory
  if (redis.status === 'ready' || redis.status === 'connecting') {
    options.store = new RedisStore({
      // @ts-expect-error - Known issue: the `call` function is not present in ioredis types
      sendCommand: (...args) => redis.call(...args),
      prefix: 'rl:',
    });
  }

  return rateLimit(options);
};

const authLimiter = createLimiter(
  15 * 60 * 1000,
  process.env.NODE_ENV === 'development' ? 1000 : 20,
  'Too many auth attempts. Please try again in 15 minutes.'
);

const apiLimiter = createLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  process.env.NODE_ENV === 'development' ? 50000 : (parseInt(process.env.RATE_LIMIT_MAX) || 100),
  'Too many requests. Please slow down.'
);

const checkoutLimiter = createLimiter(
  60 * 60 * 1000,
  10,
  'Too many checkout attempts. Please try again later.'
);

module.exports = { authLimiter, apiLimiter, checkoutLimiter };
