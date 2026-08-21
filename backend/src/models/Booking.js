const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    pnr: { type: String, required: true },
    hotelId: { type: String, required: true, index: true },
    hotelName: { type: String, required: true },
    city: { type: String },
    roomNumber: { type: String },
    roomType: { type: String },
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String },
    guestTier: { type: String },
    idProofType: {
      type: String,
      enum: ['Aadhaar Card', 'Passport', 'Voter ID', 'Driving License'],
    },
    idProofNumberMasked: { type: String },
    idVerified: { type: Boolean, default: false },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    nights: { type: Number, required: true, min: 1 },
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    amount: { type: Number, required: true, min: 0 },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    netPayable: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String },
    paymentGateway: { type: String },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded', 'Partially Refunded', 'Failed'],
      default: 'Pending',
    },
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'No Show'],
      default: 'Confirmed',
    },
    specialRequests: { type: String },
    bookedAt: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

bookingSchema.index({ guestId: 1, createdAt: -1 });
bookingSchema.index({ bookingStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
