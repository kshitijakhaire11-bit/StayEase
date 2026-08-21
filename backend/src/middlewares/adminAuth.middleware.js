const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const AdminUser = require('../models/AdminUser');

/**
 * Protects admin routes.
 * Verifies JWT, rejects pending_2fa tokens, attaches req.admin.
 */
const protectAdmin = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Admin authentication token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    // Step-1 session tokens (pending_2fa) must not access protected routes
    if (decoded.role === 'pending_2fa') {
      throw ApiError.unauthorized('2FA verification required');
    }

    // Reject customer tokens on admin routes
    if (decoded.role === 'customer') {
      throw ApiError.unauthorized('Invalid token for this resource');
    }

    const admin = await AdminUser.findById(decoded.adminId);
    if (!admin) {
      throw ApiError.unauthorized('Admin user not found');
    }
    if (!admin.isActive) {
      throw ApiError.forbidden('Admin account is deactivated');
    }

    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Role-based authorization middleware factory.
 * Usage: requireRole('super_admin', 'hotel_owner')
 */
const requireRole = (...roles) => {
  return (req, _res, next) => {
    if (!req.admin) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (!roles.includes(req.admin.role)) {
      return next(ApiError.forbidden(`Access restricted to: ${roles.join(', ')}`));
    }
    next();
  };
};

module.exports = { protectAdmin, requireRole };
