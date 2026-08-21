const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    txnId: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true, index: true },
    guestName: { type: String },
    gateway: { type: String },
    method: { type: String },
    amount: { type: Number, required: true },
    gstAmount: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    hotelPayout: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Captured & Settled', 'Processing', 'Failed', 'Refund Reversal'],
      default: 'Processing',
    },
    utrOrRrn: { type: String },
    timestamp: { type: String },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
