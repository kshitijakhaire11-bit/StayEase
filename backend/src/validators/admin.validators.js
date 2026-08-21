const { body, query, param } = require('express-validator');
const { ROOM_STATUS } = require('../constants');

const addRoomValidator = [
  body('hotelId').trim().notEmpty().withMessage('Hotel ID is required'),
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('floor').isInt({ min: 0 }).withMessage('Floor must be a non-negative integer'),
  body('type').trim().notEmpty().withMessage('Room type is required'),
  body('tier')
    .isIn(['Standard', 'Deluxe', 'Ocean Suite', 'Presidential Villa'])
    .withMessage('Tier must be one of: Standard, Deluxe, Ocean Suite, Presidential Villa'),
  body('basePrice').isFloat({ min: 0.01 }).withMessage('Base price must be a positive number'),
  body('features').optional().isArray().withMessage('Features must be an array'),
];

const updateRoomStatusValidator = [
  body('status')
    .isIn(Object.values(ROOM_STATUS))
    .withMessage(`Status must be one of: ${Object.values(ROOM_STATUS).join(', ')}`),
];

const awardPointsValidator = [
  body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason must be under 200 characters'),
];

const createHotelValidator = [
  body('hotelId').trim().notEmpty().withMessage('Hotel ID (slug) is required'),
  body('name').trim().isLength({ min: 3, max: 200 }).withMessage('Name must be 3–200 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pricePerNight').isFloat({ min: 0.01 }).withMessage('Price per night must be a positive number'),
];

const gmRespondAdminValidator = [
  body('message').trim().isLength({ min: 5, max: 1000 }).withMessage('Response must be 5–1000 characters'),
];

module.exports = {
  addRoomValidator,
  updateRoomStatusValidator,
  awardPointsValidator,
  createHotelValidator,
  gmRespondAdminValidator,
};
