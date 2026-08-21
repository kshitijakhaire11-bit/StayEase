const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.auth.controller');
const validate = require('../middlewares/validate.middleware');
const { adminLoginValidator, admin2FAValidator } = require('../validators/auth.validators');

// Step 1 — Email + password → pending_2fa session token
router.post('/login', adminLoginValidator, validate, controller.adminLogin);

// Step 2 — PIN verification → full access JWT
// Authorization: Bearer <sessionToken from step 1>
router.post('/verify-2fa', admin2FAValidator, validate, controller.verify2FA);

module.exports = router;
