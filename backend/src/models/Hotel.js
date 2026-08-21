const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    hotelId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ratingLabel: {
      type: String,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      min: 0,
    },
    taxesAndFees: {
      type: Number,
      min: 0,
    },
    nights: {
      type: Number,
      default: 1,
    },
    guests: {
      type: String,
    },
    image: {
      type: String,
    },
    gallery: [String],
    amenities: [String],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isHighDemand: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    roomType: {
      type: String,
    },
    roomsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

hotelSchema.index({ city: 1, pricePerNight: 1 });
hotelSchema.index({ name: 'text', city: 'text', location: 'text' });

module.exports = mongoose.model('Hotel', hotelSchema);
