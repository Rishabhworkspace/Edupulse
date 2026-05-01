/**
 * Reusable pagination utility
 * Returns { skip, limit } for Mongoose queries
 * and a pagination meta object for responses
 */
const paginate = (query, { page = 1, limit = 12 }) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  return {
    skip: (pageNum - 1) * limitNum,
    limit: limitNum,
  };
};

const paginationMeta = (total, page, limit) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  return {
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  };
};

module.exports = { paginate, paginationMeta };
