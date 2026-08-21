const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const env = require('../config/env');

/**
 * Centralized error handling middleware.
 * All errors flow through here for consistent API error responses.
 */
const errorHandler = (err, req, res, _next) => {
  let error = err;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.validation('Validation failed', errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(`An account with this ${field} already exists`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    error = ApiError.badRequest('Invalid ID format');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token has expired');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const code = error.code || 'INTERNAL_ERROR';

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      method: req.method,
      url: req.originalUrl,
      stack: err.stack,
    });
  } else {
    logger.warn(`${statusCode} - ${message}`, {
      method: req.method,
      url: req.originalUrl,
    });
  }

  const response = {
    success: false,
    message,
    code,
  };

  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  // Never expose stack traces in production
  if (!env.isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 handler for unmatched routes.
 */
const notFoundHandler = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'NOT_FOUND',
  });
};

module.exports = { errorHandler, notFoundHandler };
