const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone must be a valid 10-digit Indian mobile number'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('dob').optional().isISO8601().withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),
  body('language').optional().trim().isLength({ max: 50 }).withMessage('Language must be under 50 characters'),
];

const loginValidator = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const sendOtpValidator = [
  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone must be a valid 10-digit Indian mobile number'),
  body('email').optional().trim().isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body().custom((_, { req }) => {
    if (!req.body.phone && !req.body.email) {
      throw new Error('Either phone or email is required');
    }
    return true;
  }),
];

const verifyOtpValidator = [
  body('identifier').trim().notEmpty().withMessage('Identifier (phone or email) is required'),
  body('otp')
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('OTP must be exactly 6 digits'),
];

const forgotPasswordValidator = [
  body('identifier').trim().notEmpty().withMessage('Phone number or email is required'),
];

const resetPasswordValidator = [
  body('identifier').trim().notEmpty().withMessage('Identifier is required'),
  body('otp')
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('OTP must be exactly 6 digits'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const refreshTokenValidator = [
  body('refreshToken').trim().notEmpty().withMessage('Refresh token is required'),
];

const adminLoginValidator = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const admin2FAValidator = [
  body('pin')
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('PIN must be exactly 6 digits'),
];

module.exports = {
  registerValidator,
  loginValidator,
  sendOtpValidator,
  verifyOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  refreshTokenValidator,
  adminLoginValidator,
  admin2FAValidator,
};
