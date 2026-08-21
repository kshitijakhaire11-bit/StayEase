const express = require('express');
const router = express.Router();
const controller = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createReviewValidator, listReviewsQueryValidator } = require('../validators/review.validators');

// Public: list reviews for a hotel
router.get('/', listReviewsQueryValidator, validate, controller.listReviews);

// Protected: submit a review
router.post('/', protect, createReviewValidator, validate, controller.createReview);

module.exports = router;
