const reviewService = require('../services/review.service');
const ApiResponse   = require('../utils/ApiResponse');

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user, req.body);
    ApiResponse.created(res, { review }, 'Review submitted successfully');
  } catch (err) { next(err); }
};

const listReviews = async (req, res, next) => {
  try {
    const result = await reviewService.listHotelReviews(req.query);
    ApiResponse.paginated(res, result.reviews, result.pagination, 'Reviews retrieved');
  } catch (err) { next(err); }
};

module.exports = { createReview, listReviews };
