const Stripe = require('stripe');
const logger = require('../utils/logger');

const isDummy = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('dummy');

let stripe;

if (isDummy) {
  logger.warn('[Stripe] Using dummy key — payment features are disabled. Set a real STRIPE_SECRET_KEY to enable payments.');
  // Create a proxy that logs warnings instead of crashing when Stripe methods are called
  stripe = new Proxy({}, {
    get(_, prop) {
      if (prop === 'isDummy') return true;
      return new Proxy(() => {}, {
        get(_, subProp) {
          return (...args) => {
            logger.warn(`[Stripe - DEV] stripe.${prop}.${subProp}() called with dummy key — skipping.`);
            return Promise.resolve({ id: 'dummy', url: '#', status: 'dummy' });
          };
        },
        apply(_, thisArg, args) {
          logger.warn(`[Stripe - DEV] stripe.${prop}() called with dummy key — skipping.`);
          return Promise.resolve({ id: 'dummy', url: '#', status: 'dummy' });
        },
      });
    },
  });
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
  });
  stripe.isDummy = false;
}

module.exports = stripe;
