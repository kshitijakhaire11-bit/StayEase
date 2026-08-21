const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  registerValidator,
  loginValidator,
  sendOtpValidator,
  verifyOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  refreshTokenValidator,
} = require('../validators/auth.validators');

// Public routes
router.post('/register', registerValidator, validate, controller.register);
router.post('/login', loginValidator, validate, controller.login);
router.post('/send-otp', sendOtpValidator, validate, controller.sendOtp);
router.post('/verify-otp', verifyOtpValidator, validate, controller.verifyOtp);
router.post('/forgot-password', forgotPasswordValidator, validate, controller.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, controller.resetPassword);
router.post('/refresh', refreshTokenValidator, validate, controller.refreshToken);

// Protected route
router.get('/me', protect, controller.getMe);

module.exports = router;
