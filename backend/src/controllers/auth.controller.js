const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    ApiResponse.created(res, result, 'Registration successful. Welcome to StayEase!');
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    ApiResponse.success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const sendOtp = async (req, res, next) => {
  try {
    const result = await authService.sendOtpToUser(req.body);
    ApiResponse.success(res, null, result.message);
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyOtpAndLogin(req.body);
    ApiResponse.success(res, result, 'OTP verified successfully');
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body);
    ApiResponse.success(res, null, result.message);
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);
    ApiResponse.success(res, null, result.message);
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshAccessToken(req.body);
    ApiResponse.success(res, result, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    ApiResponse.success(res, { user }, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, sendOtp, verifyOtp, forgotPassword, resetPassword, refreshToken, getMe };
