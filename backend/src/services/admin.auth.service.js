const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

// ── Step 1: Email + Password → pending_2fa session token ──────────────────

const adminLogin = async ({ email, password }) => {
  const admin = await AdminUser.findOne({ email }).select('+password');
  if (!admin) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  if (!admin.isActive) {
    throw ApiError.forbidden('Admin account is deactivated. Contact the system administrator.');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  // Issue short-lived pending_2fa token (15 minutes)
  const sessionToken = jwt.sign(
    { adminId: admin._id, email: admin.email, role: 'pending_2fa' },
    env.jwtSecret,
    { expiresIn: '15m' }
  );

  logger.info(`Admin login step-1 success: ${email} [${admin.role}]`);

  return {
    sessionToken,
    admin: {
      name: admin.name,
      email: admin.email,
      role: admin.role,
      roleLabel: admin.roleLabel,
      requires2FA: admin.requires2FA,
    },
  };
};

// ── Step 2: PIN verification → full access JWT ────────────────────────────

const verify2FA = async ({ sessionToken, pin }) => {
  // Decode the pending_2fa token
  let decoded;
  try {
    decoded = jwt.verify(sessionToken, env.jwtSecret);
  } catch {
    throw ApiError.unauthorized('Session expired. Please log in again.');
  }

  if (decoded.role !== 'pending_2fa') {
    throw ApiError.unauthorized('Invalid session token');
  }

  const admin = await AdminUser.findById(decoded.adminId).select('+pin');
  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized('Admin user not found or deactivated');
  }

  // Verify PIN
  const isPinValid = await admin.comparePin(pin);
  if (!isPinValid) {
    throw ApiError.unauthorized('Invalid 2FA PIN');
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  // Issue full access token (8 hours)
  const accessToken = jwt.sign(
    {
      adminId: admin._id,
      email: admin.email,
      role: admin.role,
      hotelAccess: admin.hotelAccess,
    },
    env.jwtSecret,
    { expiresIn: '8h' }
  );

  logger.info(`Admin 2FA verified: ${admin.email} [${admin.role}]`);

  return {
    accessToken,
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      roleLabel: admin.roleLabel,
      badge: admin.badge,
      avatar: admin.avatar,
      hotelAccess: admin.hotelAccess,
      loginTime: admin.lastLogin,
    },
  };
};

module.exports = { adminLogin, verify2FA };
