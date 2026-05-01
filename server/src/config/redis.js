const Redis = require('ioredis');
const logger = require('../utils/logger');

let client;

if (process.env.REDIS_URL) {
  client = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  client.on('connect', () => logger.info('Redis connected'));
  client.on('error', (err) => {
    logger.warn(`Redis error (using in-memory fallback): ${err.message}`);
  });
} else {
  // In-memory fallback for development without Redis
  const store = new Map();
  client = {
    get: async (key) => store.get(key) || null,
    set: async (key, val, ...args) => { store.set(key, val); return 'OK'; },
    setex: async (key, ttl, val) => { store.set(key, val); return 'OK'; },
    del: async (key) => { store.delete(key); return 1; },
    incr: async (key) => {
      const v = (parseInt(store.get(key)) || 0) + 1;
      store.set(key, String(v));
      return v;
    },
    expire: async () => 1,
    ttl: async () => -1,
    on: () => {},
  };
  logger.info('Redis: using in-memory fallback (set REDIS_URL for production)');
}

module.exports = client;
