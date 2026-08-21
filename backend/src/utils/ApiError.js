/**
 * Custom API Error class for consistent error handling.
 * Extends native Error with HTTP status code and error code.
 */
class ApiError extends Error {
  constructor(statusCode, message, code = 'ERROR', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, 'BAD_REQUEST', errors);
  }

  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Access denied') {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  static conflict(message) {
    return new ApiError(409, message, 'CONFLICT');
  }

  static validation(message, errors = []) {
    return new ApiError(422, message, 'VALIDATION_ERROR', errors);
  }

  static tooMany(message = 'Too many requests') {
    return new ApiError(429, message, 'RATE_LIMIT_EXCEEDED');
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, 'INTERNAL_ERROR');
  }
}

module.exports = ApiError;
