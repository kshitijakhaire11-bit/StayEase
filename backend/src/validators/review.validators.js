const { body, query } = require('express-validator');

const createReviewValidator = [
  body('hotelId').trim().notEmpty().withMessage('Hotel ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be 10–1000 characters'),
  body('stayDate').optional().isISO8601().withMessage('Stay date must be a valid date'),
  body('roomType').optional().trim().isLength({ max: 100 }).withMessage('Room type must be under 100 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Each tag must be 1–50 characters'),
  body('subRatings.cleanliness').optional().isFloat({ min: 1, max: 5 }).withMessage('Cleanliness rating must be 1–5'),
  body('subRatings.service').optional().isFloat({ min: 1, max: 5 }).withMessage('Service rating must be 1–5'),
  body('subRatings.location').optional().isFloat({ min: 1, max: 5 }).withMessage('Location rating must be 1–5'),
  body('subRatings.value').optional().isFloat({ min: 1, max: 5 }).withMessage('Value rating must be 1–5'),
  body('subRatings.amenities').optional().isFloat({ min: 1, max: 5 }).withMessage('Amenities rating must be 1–5'),
];

const gmRespondValidator = [
  body('message').trim().isLength({ min: 5, max: 1000 }).withMessage('Response message must be 5–1000 characters'),
];

const listReviewsQueryValidator = [
  query('hotelId').trim().notEmpty().withMessage('hotelId query parameter is required'),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
];

module.exports = { createReviewValidator, gmRespondValidator, listReviewsQueryValidator };
