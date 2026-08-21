const Booking     = require('../models/Booking');
const Transaction = require('../models/Transaction');
const Refund      = require('../models/Refund');
const Review      = require('../models/Review');
const Offer       = require('../models/Offer');
const Room        = require('../models/Room');
const User        = require('../models/User');
const Hotel       = require('../models/Hotel');
const AuditLog    = require('../models/AuditLog');
const ApiError    = require('../utils/ApiError');
const logger      = require('../config/logger');

// ── Audit log helper ─────────────────────────────────────────────────────

const writeAudit = async ({ admin, action, entity, entityId, severity = 'info', req }) => {
  try {
    await AuditLog.create({
      logId: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      user: admin.name,
      role: admin.role,
      action,
      entity,
      entityId,
      ipAddress: req?.ip || 'system',
      severity,
    });
  } catch (err) {
    logger.warn('Audit log write failed:', err.message);
  }
};

// ── Rooms ────────────────────────────────────────────────────────────────

const listRooms = async ({ hotelId, floor, status, page = 1, limit = 50 }, admin) => {
  if (!hotelId) throw ApiError.badRequest('hotelId is required');

  // hotel_owner scope check
  if (admin.role === 'hotel_owner' && admin.hotelAccess !== 'all' && admin.hotelAccess !== hotelId) {
    throw ApiError.forbidden('You do not have access to this hotel');
  }

  const filter = { hotelId };
  if (floor !== undefined) filter.floor = Number(floor);
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [rooms, total] = await Promise.all([
    Room.find(filter).sort({ floor: 1, roomNumber: 1 }).skip(skip).limit(Number(limit)),
    Room.countDocuments(filter),
  ]);

  return { rooms, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
};

const addRoom = async (data, admin, req) => {
  if (admin.role === 'hotel_owner' && admin.hotelAccess !== 'all' && admin.hotelAccess !== data.hotelId) {
    throw ApiError.forbidden('You do not have access to this hotel');
  }

  const roomId = `ROOM-${data.hotelId.toUpperCase()}-${data.roomNumber}-${Date.now()}`;
  const room = await Room.create({ ...data, roomId });

  await writeAudit({ admin, action: 'ROOM_ADDED', entity: 'Room', entityId: roomId, req });
  return room;
};

const updateRoomStatus = async (id, status, admin, req) => {
  const room = await Room.findById(id);
  if (!room) throw ApiError.notFound('Room not found');

  if (admin.role === 'hotel_owner' && admin.hotelAccess !== 'all' && admin.hotelAccess !== room.hotelId) {
    throw ApiError.forbidden('You do not have access to this hotel');
  }

  const prev = room.status;
  room.status = status;

  // Clear assignment when room becomes available
  if (status === 'Clean & Available') {
    room.assignedGuest = undefined;
    room.assignedBookingId = undefined;
    room.lastCleaned = new Date().toISOString().slice(0, 10);
  }

  await room.save();
  await writeAudit({ admin, action: `ROOM_STATUS_${status.toUpperCase().replace(/\s+/g,'_')}`, entity: 'Room', entityId: room.roomId, severity: 'info', req });
  return room;
};

// ── Customers ────────────────────────────────────────────────────────────

const listCustomers = async ({ search, tier, page = 1, limit = 10 }) => {
  const filter = {};
  if (tier) filter.tier = tier;
  if (search) {
    filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [customers, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return { customers, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
};

const awardPoints = async (id, points, reason, admin, req) => {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('Customer not found');

  user.loyaltyPoints += Number(points);
  await user.save();

  await writeAudit({
    admin, action: `LOYALTY_POINTS_AWARDED_${points}`,
    entity: 'User', entityId: user._id.toString(), severity: 'info', req,
  });

  return { loyaltyPoints: user.loyaltyPoints };
};

// ── Transactions ─────────────────────────────────────────────────────────

const listTransactions = async ({ gateway, status, page = 1, limit = 10 }) => {
  const filter = {};
  if (gateway) filter.gateway = gateway;
  if (status)  filter.status  = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [transactions, total] = await Promise.all([
    Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Transaction.countDocuments(filter),
  ]);

  return { transactions, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
};

// ── Refunds ──────────────────────────────────────────────────────────────

const listRefunds = async ({ status, page = 1, limit = 10 }) => {
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [refunds, total] = await Promise.all([
    Refund.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Refund.countDocuments(filter),
  ]);
  return { refunds, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
};

const approveRefund = async (id, admin, req) => {
  const refund = await Refund.findById(id);
  if (!refund) throw ApiError.notFound('Refund not found');
  if (refund.status !== 'Pending Approval') {
    throw ApiError.conflict(`Refund is already "${refund.status}" and cannot be approved again`);
  }

  const gatewayRef = `rfnd_${Math.random().toString(36).substring(2, 10)}`;
  refund.status = 'Completed';
  refund.processedBy = admin.name;
  refund.processedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  refund.gatewayRefundRef = gatewayRef;
  await refund.save();

  // Update the linked booking
  await Booking.findOneAndUpdate(
    { bookingId: refund.bookingId },
    { paymentStatus: 'Refunded', bookingStatus: 'Cancelled' }
  );

  // Mark transaction as refund reversal
  await Transaction.findOneAndUpdate(
    { bookingId: refund.bookingId },
    { status: 'Refund Reversal' }
  );

  await writeAudit({ admin, action: 'REFUND_APPROVED', entity: 'Refund', entityId: refund.refundId, severity: 'warning', req });
  return refund;
};

const rejectRefund = async (id, admin, req) => {
  const refund = await Refund.findById(id);
  if (!refund) throw ApiError.notFound('Refund not found');
  if (refund.status !== 'Pending Approval') {
    throw ApiError.conflict(`Refund is already "${refund.status}"`);
  }

  refund.status = 'Rejected';
  refund.processedBy = admin.name;
  refund.processedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await refund.save();

  await writeAudit({ admin, action: 'REFUND_REJECTED', entity: 'Refund', entityId: refund.refundId, severity: 'warning', req });
  return refund;
};

// ── Reviews (admin) ──────────────────────────────────────────────────────

const adminRespondToReview = async (id, message, admin, req) => {
  const review = await Review.findById(id);
  if (!review) throw ApiError.notFound('Review not found');

  if (admin.role === 'hotel_owner' && admin.hotelAccess !== 'all' && admin.hotelAccess !== review.hotelId) {
    throw ApiError.forbidden('You do not have access to this hotel');
  }

  review.response = {
    respondedAt: new Date().toISOString().slice(0, 10),
    responderName: admin.name,
    message,
  };
  await review.save();

  await writeAudit({ admin, action: 'REVIEW_GM_RESPONSE', entity: 'Review', entityId: review.reviewId, req });
  return review;
};

// ── Offers (admin) ───────────────────────────────────────────────────────

const adminToggleOffer = async (id, admin, req) => {
  const offer = await Offer.findById(id);
  if (!offer) throw ApiError.notFound('Offer not found');

  offer.isActive = !offer.isActive;
  await offer.save();

  await writeAudit({ admin, action: `OFFER_${offer.isActive ? 'ACTIVATED' : 'DEACTIVATED'}`, entity: 'Offer', entityId: offer.offerId, req });
  return { id: offer._id, offerId: offer.offerId, code: offer.code, isActive: offer.isActive };
};

// ── Analytics Overview ───────────────────────────────────────────────────

const getAnalyticsOverview = async ({ hotelId }, admin) => {
  const bookingFilter = {};

  // Scope by hotel
  if (admin.role === 'hotel_owner' && admin.hotelAccess !== 'all') {
    bookingFilter.hotelId = admin.hotelAccess;
  } else if (hotelId && hotelId !== 'all') {
    bookingFilter.hotelId = hotelId;
  }

  const [
    totalRevenueResult,
    activeBookings,
    pendingRefunds,
    totalBookings,
  ] = await Promise.all([
    Transaction.aggregate([
      { $match: { status: 'Captured & Settled' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Booking.countDocuments({ ...bookingFilter, bookingStatus: { $in: ['Confirmed', 'Checked In'] } }),
    Refund.countDocuments({ status: 'Pending Approval' }),
    Booking.countDocuments({ ...bookingFilter, paymentStatus: 'Paid' }),
  ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  // ADR = total revenue / total booked nights
  const nightsResult = await Booking.aggregate([
    { $match: { ...bookingFilter, paymentStatus: 'Paid' } },
    { $group: { _id: null, totalNights: { $sum: '$nights' }, totalRevenue: { $sum: '$amount' } } },
  ]);
  const totalNights = nightsResult[0]?.totalNights || 1;
  const bookingRevenue = nightsResult[0]?.totalRevenue || 0;
  const adr = Math.round(bookingRevenue / totalNights);

  // Occupancy % — rooms occupied vs total rooms
  const totalRooms = await Room.countDocuments(hotelId && hotelId !== 'all' ? { hotelId } : {});
  const occupiedRooms = await Room.countDocuments({
    ...(hotelId && hotelId !== 'all' ? { hotelId } : {}),
    status: 'Occupied',
  });
  const occupancyPct = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Revenue by month (last 8 months) — aggregated from Transactions
  const eightMonthsAgo = new Date();
  eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

  const revenueByMonth = await Transaction.aggregate([
    { $match: { status: 'Captured & Settled', createdAt: { $gte: eightMonthsAgo } } },
    { $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      revenueLakhs: { $sum: { $divide: ['$amount', 100000] } },
      bookingsCount: { $sum: 1 },
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $project: {
      _id: 0,
      month: { $dateToString: { format: '%b %Y', date: { $dateFromParts: { year: '$_id.year', month: '$_id.month', day: 1 } } } },
      revenueLakhs: { $round: ['$revenueLakhs', 2] },
      bookingsCount: 1,
    }},
  ]);

  // City distribution
  const cityDistribution = await Booking.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $group: { _id: '$city', bookingsCount: { $sum: 1 }, totalRevenue: { $sum: '$amount' } } },
    { $sort: { bookingsCount: -1 } },
    { $limit: 6 },
    { $project: { _id: 0, city: '$_id', bookingsCount: 1, revenueShareLakhs: { $round: [{ $divide: ['$totalRevenue', 100000] }, 2] } } },
  ]);

  // Payment method mix
  const paymentMix = await Booking.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, name: '$_id', count: 1 } },
  ]);

  const totalPaid = paymentMix.reduce((s, p) => s + p.count, 0) || 1;
  const paymentMixPct = paymentMix.map(p => ({ name: p.name, value: Math.round((p.count / totalPaid) * 100) }));

  return {
    totalRevenue,
    occupancyPct,
    adr,
    activeBookings,
    pendingRefunds,
    totalBookings,
    revenueByMonth,
    cityDistribution,
    paymentMix: paymentMixPct,
  };
};

// ── Audit Logs ───────────────────────────────────────────────────────────

const listAuditLogs = async ({ severity, page = 1, limit = 20 }) => {
  const filter = severity ? { severity } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    AuditLog.countDocuments(filter),
  ]);
  return { logs, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
};

module.exports = {
  listRooms, addRoom, updateRoomStatus,
  listCustomers, awardPoints,
  listTransactions,
  listRefunds, approveRefund, rejectRefund,
  adminRespondToReview,
  adminToggleOffer,
  getAnalyticsOverview,
  listAuditLogs,
  writeAudit,
};
