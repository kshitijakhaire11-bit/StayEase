const express = require('express');
const router = express.Router();
const controller = require('../controllers/hotel.controller');
const { protectAdmin, requireRole } = require('../middlewares/adminAuth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createHotelValidator } = require('../validators/admin.validators');

// Public
router.get('/', controller.listHotels);
router.get('/:hotelId', controller.getHotel);

// Admin only
router.post('/', protectAdmin, requireRole('super_admin', 'hotel_owner'), createHotelValidator, validate, controller.createHotel);
router.patch('/:hotelId', protectAdmin, requireRole('super_admin', 'hotel_owner'), controller.updateHotel);

module.exports = router;
