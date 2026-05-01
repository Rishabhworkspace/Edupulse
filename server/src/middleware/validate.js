const Zod = require('zod');
const ApiError = require('../utils/ApiError');

const validate = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.parseAsync(req.body);
    req.body = validated;
    next();
  } catch (err) {
    if (err instanceof Zod.ZodError) {
      const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
      return next(new ApiError(400, 'Validation failed', errors));
    }
    next(err);
  }
};

const validateParams = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.parseAsync(req.params);
    req.params = validated;
    next();
  } catch (err) {
    if (err instanceof Zod.ZodError) {
      const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
      return next(new ApiError(400, 'Invalid parameters', errors));
    }
    next(err);
  }
};

const validateQuery = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.parseAsync(req.query);
    req.query = validated;
    next();
  } catch (err) {
    if (err instanceof Zod.ZodError) {
      const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
      return next(new ApiError(400, 'Invalid query parameters', errors));
    }
    next(err);
  }
};

module.exports = { validate, validateParams, validateQuery };