const Review = require('../models/Review');
const Hotel  = require('../models/Hotel');
const ApiError = require('../utils/ApiError');

const generateReviewId = () => `REV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// ── Customer: Submit review ──────────────────────────────────────────────

const createReview = async (user, body) => {
  const { hotelId, rating, comment, stayDate, roomType, tags, subRatings } = body;

  const hotel = await Hotel.findOne({ hotelId });
  if (!hotel) throw ApiError.notFound('Hotel not found');

  const review = await Review.create({
    reviewId: generateReviewId(),
    hotelId,
    hotelName: hotel.name,
    city: hotel.city,
    guestId: user._id,
    guestName: user.name,
    guestTier: user.tier,
    rating,
    subRatings: subRatings || {},
    stayDate: stayDate || new Date().toISOString().slice(0, 10),
    roomType: roomType || '',
    comment,
    tags: tags || [],
  });

  // Update hotel aggregate rating
  const allReviews = await Review.find({ hotelId });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await Hotel.findOneAndUpdate({ hotelId }, {
    rating: Math.round(avgRating * 10) / 10,
    reviewsCount: allReviews.length,
  });

  return review;
};

// ── Public: List reviews for a hotel ────────────────────────────────────

const listHotelReviews = async ({ hotelId, page = 1, limit = 10 }) => {
  const skip = (Number(page) - 1) * Number(limit);
  const [reviews, total] = await Promise.all([
    Review.find({ hotelId }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Review.countDocuments({ hotelId }),
  ]);
  return {
    reviews,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  };
};

// ── Admin: List all reviews ──────────────────────────────────────────────

const adminListReviews = async ({ hotelId, page = 1, limit = 10 }) => {
  const filter = hotelId ? { hotelId } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [reviews, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Review.countDocuments(filter),
  ]);
  return {
    reviews,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  };
};

// ── Admin: GM respond to review ──────────────────────────────────────────

const respondToReview = async (id, message, admin) => {
  const review = await Review.findById(id);
  if (!review) throw ApiError.notFound('Review not found');

  review.response = {
    respondedAt: new Date().toISOString().slice(0, 10),
    responderName: admin.name,
    message,
  };
  await review.save();
  return review;
};

module.exports = { createReview, listHotelReviews, adminListReviews, respondToReview };
