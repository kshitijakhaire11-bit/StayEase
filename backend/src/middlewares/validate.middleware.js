const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after express-validator checks.
 * Collects errors and throws ApiError.validation if any.
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));
    throw ApiError.validation('Validation failed', formattedErrors);
  }
  next();
};

module.exports = validate;
