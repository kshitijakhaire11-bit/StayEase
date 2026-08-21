const { body, query } = require('express-validator');

const validateOfferCodeValidator = [
  body('code').trim().notEmpty().withMessage('Offer code is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
];

const createOfferValidator = [
  body('code')
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9]{3,20}$/)
    .withMessage('Offer code must be 3–20 uppercase alphanumeric characters'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3–100 characters'),
  body('description').optional().trim().isLength({ max: 300 }).withMessage('Description must be under 300 characters'),
  body('discountType')
    .isIn(['Percentage', 'Flat'])
    .withMessage('Discount type must be Percentage or Flat'),
  body('discountValue')
    .isFloat({ min: 0.01 })
    .withMessage('Discount value must be a positive number'),
  body('minSpend')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum spend must be 0 or more'),
  body('maxDiscount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Max discount must be a positive number'),
  body('validFrom')
    .isISO8601()
    .withMessage('Valid from must be a valid date'),
  body('validUntil')
    .isISO8601()
    .withMessage('Valid until must be a valid date')
    .custom((validUntil, { req }) => {
      if (validUntil <= req.body.validFrom) {
        throw new Error('Valid until must be after valid from');
      }
      return true;
    }),
  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer'),
  body('applicableTier')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Applicable tier must be under 50 characters'),
];

module.exports = { validateOfferCodeValidator, createOfferValidator };
