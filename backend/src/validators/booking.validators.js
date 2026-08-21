const { body, query, param } = require('express-validator');
const { PAYMENT_METHODS, ID_PROOF_TYPES } = require('../constants');

const createBookingValidator = [
  body('hotelId').trim().notEmpty().withMessage('Hotel ID is required'),
  body('roomType').trim().notEmpty().withMessage('Room type is required'),
  body('checkIn')
    .trim()
    .notEmpty().withMessage('Check-in date is required')
    .isISO8601().withMessage('Check-in must be a valid date (YYYY-MM-DD)'),
  body('checkOut')
    .trim()
    .notEmpty().withMessage('Check-out date is required')
    .isISO8601().withMessage('Check-out must be a valid date (YYYY-MM-DD)')
    .custom((checkOut, { req }) => {
      if (checkOut <= req.body.checkIn) {
        throw new Error('Check-out must be after check-in');
      }
      return true;
    }),
  body('nights')
    .isInt({ min: 1 })
    .withMessage('Nights must be a positive integer'),
  body('adults')
    .isInt({ min: 1 })
    .withMessage('At least 1 adult is required'),
  body('children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Children count must be 0 or more'),
  body('guestName').trim().isLength({ min: 2, max: 100 }).withMessage('Guest name must be 2–100 characters'),
  body('guestEmail').trim().isEmail().normalizeEmail().withMessage('Valid guest email is required'),
  body('guestPhone').trim().notEmpty().withMessage('Guest phone is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('paymentMethod')
    .isIn(PAYMENT_METHODS)
    .withMessage(`Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`),
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special requests must be under 500 characters'),
  body('idProofType')
    .optional()
    .isIn(ID_PROOF_TYPES)
    .withMessage(`ID proof type must be one of: ${ID_PROOF_TYPES.join(', ')}`),
  body('offerCode')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Offer code must be 1–30 characters'),
];

const updateBookingStatusValidator = [
  param('id').trim().notEmpty().withMessage('Booking ID is required'),
  body('status')
    .isIn(['Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'No Show'])
    .withMessage('Invalid booking status'),
];

const listBookingsQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1').toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1–50').toInt(),
];

module.exports = {
  createBookingValidator,
  updateBookingStatusValidator,
  listBookingsQueryValidator,
};
