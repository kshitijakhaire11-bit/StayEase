const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');
const Refund = require('../models/Refund');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const Offer = require('../models/Offer');
const ApiError = require('../utils/ApiError');
const { generateBookingId, generatePNR, generateTxnId, generateRefundId } = require('../utils/idGenerator');
const logger = require('../config/logger');

// ── Business rule helpers ────────────────────────────────────────────────

/**
 * BR-004: taxes = 18% GST, platformFee = 5%, hotelPayout = amount - platformFee
 */
const calculatePricing = (amount, discount = 0) => {
  const taxes = Math.round(amount * 0.18);
  const netPayable = amount + taxes - discount;
  const platformFee = Math.round(amount * 0.05);
  const gstAmount = taxes;
  const hotelPayout = amount - platformFee;
  return { taxes, netPayable, platformFee, gstAmount, hotelPayout };
};

/**
 * BR-006: Cancellation penalty based on hours before check-in
 */
const calcCancellationPenalty = (checkIn, pricePerNight) => {
  const now = new Date();
  const checkInDate = new Date(checkIn);
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

  if (hoursUntilCheckIn > 48) return 0;
  if (hoursUntilCheckIn >= 24) return pricePerNight; // 1 night charge
  return pricePerNight * 2; // full penalty (2 nights minimum)
};

/**
 * BR-005: Valid booking status transitions
 */
const VALID_TRANSITIONS = {
  Confirmed: ['Checked In', 'Cancelled', 'No Show'],
  'Checked In': ['Checked Out', 'Cancelled'],
  'Checked Out': [],
  Cancelled: [],
  'No Show': [],
};

const assertValidTransition = (current, next) => {
  const allowed = VALID_TRANSITIONS[current] || [];
  if (!allowed.includes(next)) {
    throw ApiError.conflict(
      `Cannot transition booking from "${current}" to "${next}". Allowed: ${allowed.join(', ') || 'none'}`
    );
  }
};

// ── Apply Offer Code ─────────────────────────────────────────────────────

const applyOffer = async (offerCode, amount) => {
  if (!offerCode) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const offer = await Offer.findOne({ code: offerCode.toUpperCase(), isActive: true });

  if (!offer) throw ApiError.notFound('Offer code not found or inactive');
  if (offer.validUntil < today) throw ApiError.badRequest('Offer code has expired');
  if (offer.validFrom > today) throw ApiError.badRequest('Offer code is not yet active');
  if (amount < offer.minSpend) throw ApiError.badRequest(`Minimum spend of ₹${offer.minSpend} required for this offer`);
  if (offer.usageCount >= offer.usageLimit) throw ApiError.badRequest('Offer usage limit reached');

  let discount = 0;
  if (offer.discountType === 'Percentage') {
    discount = Math.round(amount * offer.discountValue / 100);
    if (offer.maxDiscount) discount = Math.min(discount, offer.maxDiscount);
  } else {
    discount = offer.discountValue;
  }

  // Increment usage count
  offer.usageCount += 1;
  await offer.save();

  return discount;
};

// ── Create Booking (Customer) ────────────────────────────────────────────

const createBooking = async (user, body) => {
  const {
    hotelId, roomType, checkIn, checkOut, nights, adults, children = 0,
    guestName, guestEmail, guestPhone, amount, paymentMethod,
    specialRequests, idProofType, offerCode,
  } = body;

  const hotel = await Hotel.findOne({ hotelId, isActive: true });
  if (!hotel) throw ApiError.notFound('Hotel not found');

  const discount = await applyOffer(offerCode, amount);
  const { taxes, netPayable, platformFee, gstAmount, hotelPayout } = calculatePricing(amount, discount);

  const bookingId = generateBookingId();
  const pnr = generatePNR(hotel.city);

  const booking = await Booking.create({
    bookingId,
    pnr,
    hotelId,
    hotelName: hotel.name,
    city: hotel.city,
    roomType,
    guestId: user._id,
    guestName,
    guestEmail,
    guestPhone,
    guestTier: user.tier,
    idProofType: idProofType || undefined,
    checkIn,
    checkOut,
    nights,
    adults,
    children,
    amount,
    taxes,
    discount,
    netPayable,
    paymentMethod,
    paymentGateway: 'Razorpay', // Default gateway — real integration TODO
    paymentStatus: 'Pending',
    bookingStatus: 'Confirmed',
    specialRequests: specialRequests || '',
    bookedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  // Create Transaction record
  const txnId = generateTxnId();
  const transaction = await Transaction.create({
    txnId,
    bookingId,
    guestName,
    gateway: 'Razorpay',
    method: paymentMethod,
    amount: netPayable,
    gstAmount,
    platformFee,
    hotelPayout,
    status: 'Processing',
    utrOrRrn: '',
    timestamp: new Date().toISOString(),
  });

  // Mock payment processing: immediately mark as paid in dev mode
  booking.paymentStatus = 'Paid';
  await booking.save();

  transaction.status = 'Captured & Settled';
  transaction.utrOrRrn = `UTR${Date.now()}`;
  await transaction.save();

  // Update user statistics
  await User.findByIdAndUpdate(user._id, {
    $inc: { totalBookings: 1, totalSpend: netPayable },
  });

  logger.info(`Booking created: ${bookingId} for user ${user.email}`);
  return { booking, transaction };
};

// ── Customer: List Own Bookings ──────────────────────────────────────────

const getUserBookings = async (userId, { page = 1, limit = 10 }) => {
  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find({ guestId: userId }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Booking.countDocuments({ guestId: userId }),
  ]);
  return {
    bookings,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  };
};

// ── Customer: Get Single Booking ─────────────────────────────────────────

const getBookingById = async (bookingId, userId, isAdmin = false) => {
  const booking = await Booking.findOne({ bookingId });
  if (!booking) throw ApiError.notFound('Booking not found');

  // Customers can only see their own bookings
  if (!isAdmin && booking.guestId?.toString() !== userId.toString()) {
    throw ApiError.forbidden('You do not have access to this booking');
  }

  return booking;
};

// ── Admin: List All Bookings ─────────────────────────────────────────────

const adminListBookings = async ({ hotelId, bookingStatus, paymentStatus, search, page = 1, limit = 10 }, adminRole, hotelAccess) => {
  const filter = {};

  // hotel_owner scoped access
  if (adminRole === 'hotel_owner' && hotelAccess !== 'all') {
    filter.hotelId = hotelAccess;
  } else if (hotelId) {
    filter.hotelId = hotelId;
  }

  if (bookingStatus) filter.bookingStatus = bookingStatus;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  if (search) {
    filter.$or = [
      { bookingId: { $regex: search, $options: 'i' } },
      { pnr: { $regex: search, $options: 'i' } },
      { guestName: { $regex: search, $options: 'i' } },
      { guestPhone: { $regex: search, $options: 'i' } },
      { guestEmail: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  };
};

// ── Admin: Update Booking Status ─────────────────────────────────────────

const updateBookingStatus = async (bookingId, newStatus, admin) => {
  const booking = await Booking.findOne({ bookingId });
  if (!booking) throw ApiError.notFound('Booking not found');

  // hotel_owner scope check
  if (admin.role === 'hotel_owner' && admin.hotelAccess !== 'all' && admin.hotelAccess !== booking.hotelId) {
    throw ApiError.forbidden('You do not have access to this booking');
  }

  assertValidTransition(booking.bookingStatus, newStatus);

  booking.bookingStatus = newStatus;

  // Auto-create refund on cancellation
  if (newStatus === 'Cancelled' && booking.paymentStatus === 'Paid') {
    const penalty = calcCancellationPenalty(booking.checkIn, booking.amount / booking.nights);
    const refundAmount = Math.max(0, booking.netPayable - penalty);

    await Refund.create({
      refundId: generateRefundId(),
      bookingId,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      hotelName: booking.hotelName,
      totalBookingAmount: booking.netPayable,
      refundAmount,
      cancellationPenalty: penalty,
      reason: 'Booking cancelled by admin',
      requestedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      slaHoursLeft: 2,
      status: 'Pending Approval',
      refundMethod: booking.paymentMethod === 'UPI' ? 'Instant UPI Reversal' : 'Source Card Reversal',
    });

    booking.paymentStatus = 'Partially Refunded';
  }

  await booking.save();
  logger.info(`Booking ${bookingId} status → ${newStatus} by ${admin.email}`);
  return booking;
};

// ── Admin: Create Walk-In Booking ────────────────────────────────────────

const adminCreateBooking = async (admin, body) => {
  const {
    hotelId, roomNumber, roomType, guestName, guestEmail = 'guest@stayease.in',
    guestPhone, checkIn, checkOut, nights, adults = 2, children = 0,
    amount, paymentMethod = 'UPI', specialRequests, notes,
  } = body;

  const hotel = await Hotel.findOne({ hotelId });
  if (!hotel) throw ApiError.notFound('Hotel not found');

  const { taxes, netPayable, platformFee, gstAmount, hotelPayout } = calculatePricing(amount);
  const bookingId = generateBookingId();
  const pnr = generatePNR(hotel.city);

  const booking = await Booking.create({
    bookingId,
    pnr,
    hotelId,
    hotelName: hotel.name,
    city: hotel.city,
    roomNumber,
    roomType,
    guestName,
    guestEmail,
    guestPhone,
    checkIn,
    checkOut,
    nights,
    adults,
    children,
    amount,
    taxes,
    discount: 0,
    netPayable,
    paymentMethod,
    paymentGateway: 'Direct PMS BillDesk',
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    specialRequests: specialRequests || '',
    notes: notes || 'Walk-in reservation created by admin',
    bookedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  const transaction = await Transaction.create({
    txnId: generateTxnId(),
    bookingId,
    guestName,
    gateway: 'BillDesk',
    method: paymentMethod,
    amount: netPayable,
    gstAmount,
    platformFee,
    hotelPayout,
    status: 'Captured & Settled',
    utrOrRrn: `PMS${Date.now()}`,
    timestamp: new Date().toISOString(),
  });

  logger.info(`Walk-in booking ${bookingId} created by admin ${admin.email}`);
  return { booking, transaction };
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  adminListBookings,
  updateBookingStatus,
  adminCreateBooking,
  calculatePricing,
};
