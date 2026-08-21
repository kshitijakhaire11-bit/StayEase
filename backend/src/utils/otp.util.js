const env = require('../config/env');

/**
 * Generate a 6-digit OTP.
 * In mock mode, always returns the configured mock code.
 */
const generateOtp = () => {
  if (env.otpMode === 'mock') {
    return env.otpMockCode;
  }
  return String(Math.floor(100000 + Math.random() * 900000));
};

/**
 * Verify an OTP.
 * In mock mode, compares against the configured mock code.
 */
const verifyOtp = (providedOtp, storedOtp) => {
  if (env.otpMode === 'mock') {
    return providedOtp === env.otpMockCode;
  }
  return providedOtp === storedOtp;
};

/**
 * Simulate sending OTP via SMS/Email.
 * In production, integrate with Twilio/AWS SNS/Airtel IQ.
 */
const sendOtp = async (target, otp) => {
  if (env.otpMode === 'mock') {
    // Log the OTP in development for testing
    const logger = require('../config/logger');
    logger.info(`[MOCK OTP] Sending OTP ${otp} to ${target}`);
    return { success: true, message: 'OTP sent (mock mode)' };
  }

  // TODO: Integrate real OTP provider
  throw new Error('Real OTP provider not configured');
};

module.exports = {
  generateOtp,
  verifyOtp,
  sendOtp,
};
