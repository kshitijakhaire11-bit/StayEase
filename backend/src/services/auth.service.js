const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { generateOtp, verifyOtp, sendOtp } = require('../utils/otp.util');
const logger = require('../config/logger');

// ── Token helpers ──────────────────────────────────────────────────────────

const signAccessToken = (userId, email) =>
  jwt.sign({ userId, email, role: 'customer' }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

const signRefreshToken = (userId) =>
  jwt.sign({ userId, role: 'customer' }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });

const buildAuthResponse = (user) => ({
  accessToken: signAccessToken(user._id, user.email),
  refreshToken: signRefreshToken(user._id),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    tier: user.tier,
    loyaltyPoints: user.loyaltyPoints,
    totalBookings: user.totalBookings,
    totalSpend: user.totalSpend,
    avatar: user.avatar,
  },
});

// ── Register ───────────────────────────────────────────────────────────────

const register = async ({ name, phone, email, password, dob, language }) => {
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    const field = existing.email === email ? 'email' : 'phone';
    throw ApiError.conflict(`An account with this ${field} already exists`);
  }

  const user = await User.create({
    name,
    phone,
    email,
    password,
    dob: dob || undefined,
    language: language || 'English (India)',
  });

  logger.info(`New user registered: ${email}`);
  return buildAuthResponse(user);
};

// ── Email + Password Login ─────────────────────────────────────────────────

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (!user.isActive) {
    throw ApiError.unauthorized('Account is deactivated. Contact support.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  logger.info(`User login: ${email}`);
  return buildAuthResponse(user);
};

// ── Send OTP ───────────────────────────────────────────────────────────────

const sendOtpToUser = async ({ phone, email }) => {
  const identifier = phone || email;
  const field = phone ? 'phone' : 'email';

  // For existing users (login OTP), user must exist
  // For registration OTP, user may not exist yet — we just send and store in a temp way
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Try to find existing user to store OTP
  const query = phone ? { phone } : { email };
  const user = await User.findOne(query);

  if (user) {
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    user.otpAttempts = 0;
    await user.save();
  }
  // If user doesn't exist, OTP is purely for registration verification — stored client-side in this phase

  await sendOtp(identifier, otp);
  logger.info(`OTP sent to ${field}: ${identifier}`);
  return { message: 'OTP sent successfully' };
};

// ── Verify OTP ─────────────────────────────────────────────────────────────

const verifyOtpAndLogin = async ({ identifier, otp }) => {
  // Determine whether identifier is phone or email
  const isPhone = /^[6-9]\d{9}$/.test(identifier);
  const query = isPhone ? { phone: identifier } : { email: identifier };

  const user = await User.findOne(query).select('+otp +otpExpiresAt +otpAttempts');
  if (!user) {
    throw ApiError.notFound('No account found for this identifier. Please register first.');
  }

  if (user.otpAttempts >= 3) {
    throw ApiError.tooMany('Too many failed attempts. Please request a new OTP.');
  }

  // In mock mode, verifyOtp checks against OTP_MOCK_CODE
  const isValid = verifyOtp(otp, user.otp);
  if (!isValid) {
    user.otpAttempts = (user.otpAttempts || 0) + 1;
    await user.save();
    const remaining = 3 - user.otpAttempts;
    throw ApiError.badRequest(
      remaining > 0
        ? `Invalid OTP. ${remaining} attempt(s) remaining.`
        : 'Too many failed attempts. Please request a new OTP.'
    );
  }

  // Check expiry (skip in mock mode for convenience)
  if (env.otpMode !== 'mock' && user.otpExpiresAt && new Date() > user.otpExpiresAt) {
    throw ApiError.badRequest('OTP has expired. Please request a new one.');
  }

  // Clear OTP fields
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  user.otpAttempts = 0;
  await user.save();

  logger.info(`OTP verified for: ${identifier}`);
  return buildAuthResponse(user);
};

// ── Forgot Password ────────────────────────────────────────────────────────

const forgotPassword = async ({ identifier }) => {
  const isPhone = /^[6-9]\d{9}$/.test(identifier);
  const query = isPhone ? { phone: identifier } : { email: identifier };

  const user = await User.findOne(query);
  if (!user) {
    // Don't reveal if user exists — generic success response
    return { message: 'If an account exists for this identifier, an OTP has been sent.' };
  }

  const otp = generateOtp();
  user.passwordResetOtp = otp;
  user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOtp(identifier, otp);
  logger.info(`Password reset OTP sent to: ${identifier}`);
  return { message: 'If an account exists for this identifier, an OTP has been sent.' };
};

// ── Reset Password ─────────────────────────────────────────────────────────

const resetPassword = async ({ identifier, otp, newPassword }) => {
  const isPhone = /^[6-9]\d{9}$/.test(identifier);
  const query = isPhone ? { phone: identifier } : { email: identifier };

  const user = await User.findOne(query).select('+passwordResetOtp +passwordResetExpiresAt');
  if (!user) {
    throw ApiError.badRequest('Invalid identifier or OTP');
  }

  const isValid = verifyOtp(otp, user.passwordResetOtp);
  if (!isValid) {
    throw ApiError.badRequest('Invalid or expired OTP');
  }

  if (env.otpMode !== 'mock' && user.passwordResetExpiresAt && new Date() > user.passwordResetExpiresAt) {
    throw ApiError.badRequest('OTP has expired. Please request a new one.');
  }

  user.password = newPassword;
  user.passwordResetOtp = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();

  logger.info(`Password reset for: ${identifier}`);
  return { message: 'Password reset successful. Please log in with your new password.' };
};

// ── Refresh Token ──────────────────────────────────────────────────────────

const refreshAccessToken = async ({ refreshToken }) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or deactivated');
  }

  return { accessToken: signAccessToken(user._id, user.email) };
};

// ── Get Current User ───────────────────────────────────────────────────────

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

module.exports = {
  register,
  login,
  sendOtpToUser,
  verifyOtpAndLogin,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  getMe,
};
