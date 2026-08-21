const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    hotelId: { type: String, required: true, index: true },
    roomNumber: { type: String, required: true },
    floor: { type: Number, required: true },
    type: { type: String, required: true },
    tier: {
      type: String,
      enum: ['Standard', 'Deluxe', 'Ocean Suite', 'Presidential Villa'],
      required: true,
    },
    basePrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Clean & Available', 'Dirty', 'Occupied', 'Inspected', 'Maintenance', 'Blocked'],
      default: 'Clean & Available',
    },
    assignedGuest: { type: String },
    assignedBookingId: { type: String },
    lastCleaned: { type: String },
    housekeeper: { type: String },
    features: [String],
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

roomSchema.index({ hotelId: 1, status: 1 });

module.exports = mongoose.model('Room', roomSchema);
