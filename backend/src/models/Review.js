const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewId: { type: String, required: true, unique: true },
    hotelId: { type: String, required: true, index: true },
    hotelName: { type: String },
    city: { type: String },
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: { type: String, required: true },
    guestTier: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    subRatings: {
      cleanliness: { type: Number, min: 1, max: 5 },
      service: { type: Number, min: 1, max: 5 },
      location: { type: Number, min: 1, max: 5 },
      value: { type: Number, min: 1, max: 5 },
      amenities: { type: Number, min: 1, max: 5 },
    },
    stayDate: { type: String },
    roomType: { type: String },
    comment: { type: String, required: true },
    tags: [String],
    response: {
      respondedAt: String,
      responderName: String,
      message: String,
    },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

reviewSchema.index({ hotelId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
