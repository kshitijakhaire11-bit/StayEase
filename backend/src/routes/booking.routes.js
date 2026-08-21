const express = require('express');
const router = express.Router();
const controller = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createBookingValidator,
  listBookingsQueryValidator,
} = require('../validators/booking.validators');

// All booking routes require customer authentication
router.post('/', protect, createBookingValidator, validate, controller.createBooking);
router.get('/', protect, listBookingsQueryValidator, validate, controller.getMyBookings);
router.get('/:bookingId', protect, controller.getBooking);

module.exports = router;
