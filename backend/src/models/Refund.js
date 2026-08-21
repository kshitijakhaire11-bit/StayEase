const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema(
  {
    refundId: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true, index: true },
    guestName: { type: String },
    guestEmail: { type: String },
    hotelName: { type: String },
    totalBookingAmount: { type: Number },
    refundAmount: { type: Number, required: true },
    cancellationPenalty: { type: Number, default: 0 },
    reason: { type: String },
    requestedAt: { type: String },
    slaHoursLeft: { type: Number },
    status: {
      type: String,
      enum: ['Pending Approval', 'Approved & Processing', 'Completed', 'Rejected'],
      default: 'Pending Approval',
    },
    refundMethod: {
      type: String,
      enum: ['Instant UPI Reversal', 'Source Card Reversal', 'NEFT Bank Transfer'],
    },
    gatewayRefundRef: { type: String },
    processedBy: { type: String },
    processedAt: { type: String },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

module.exports = mongoose.model('Refund', refundSchema);
