const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * Protects customer routes.
 * Verifies JWT from Authorization header, fetches user, attaches to req.user.
 */
const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    // Reject admin tokens used on customer routes
    if (decoded.role && decoded.role !== 'customer') {
      throw ApiError.unauthorized('Invalid token for this resource');
    }

    const user = await User.findById(decoded.userId).select('-password -otp -otpExpiresAt -otpAttempts -passwordResetOtp -passwordResetExpiresAt');
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }
    if (!user.isActive) {
      throw ApiError.unauthorized('Account is deactivated');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Optional auth — attaches req.user if token is present, but does not block.
 * Use for routes that work for both guests and logged-in users.
 */
const optionalProtect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.role === 'customer') {
      const user = await User.findById(decoded.userId);
      if (user && user.isActive) req.user = user;
    }
    next();
  } catch {
    // Ignore invalid token — treat as unauthenticated
    next();
  }
};

module.exports = { protect, optionalProtect };
