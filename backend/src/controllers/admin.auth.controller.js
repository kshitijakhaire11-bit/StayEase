const adminAuthService = require('../services/admin.auth.service');
const ApiResponse = require('../utils/ApiResponse');

const adminLogin = async (req, res, next) => {
  try {
    const result = await adminAuthService.adminLogin(req.body);
    ApiResponse.success(res, result, 'Credentials verified. Complete 2FA to access the dashboard.');
  } catch (err) {
    next(err);
  }
};

const verify2FA = async (req, res, next) => {
  try {
    // sessionToken comes from the Authorization header (Bearer <pending_2fa token>)
    const authHeader = req.headers.authorization || '';
    const sessionToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!sessionToken) {
      const err = require('../utils/ApiError').unauthorized('Session token required in Authorization header');
      return next(err);
    }

    const result = await adminAuthService.verify2FA({ sessionToken, pin: req.body.pin });
    ApiResponse.success(res, result, 'Authentication complete. Welcome to the StayEase Admin Console.');
  } catch (err) {
    next(err);
  }
};

module.exports = { adminLogin, verify2FA };
