const adminService   = require('../services/admin.service');
const bookingService = require('../services/booking.service');
const offerService   = require('../services/offer.service');
const hotelService   = require('../services/hotel.service');
const ApiResponse    = require('../utils/ApiResponse');

// ── Bookings ─────────────────────────────────────────────────────────────

const listBookings = async (req, res, next) => {
  try {
    const result = await bookingService.adminListBookings(req.query, req.admin.role, req.admin.hotelAccess);
    ApiResponse.paginated(res, result.bookings, result.pagination, 'Bookings retrieved');
  } catch (err) { next(err); }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status, req.admin);

    await adminService.writeAudit({
      admin: req.admin,
      action: `BOOKING_STATUS_${req.body.status.toUpperCase().replace(/\s+/g, '_')}`,
      entity: 'Booking', entityId: req.params.id, severity: 'info', req,
    });

    ApiResponse.success(res, { booking }, 'Booking status updated');
  } catch (err) { next(err); }
};

const createWalkInBooking = async (req, res, next) => {
  try {
    const result = await bookingService.adminCreateBooking(req.admin, req.body);
    await adminService.writeAudit({
      admin: req.admin, action: 'WALKIN_BOOKING_CREATED',
      entity: 'Booking', entityId: result.booking.bookingId, severity: 'info', req,
    });
    ApiResponse.created(res, result, 'Walk-in booking created');
  } catch (err) { next(err); }
};

// ── Rooms ─────────────────────────────────────────────────────────────────

const listRooms = async (req, res, next) => {
  try {
    const result = await adminService.listRooms(req.query, req.admin);
    ApiResponse.paginated(res, result.rooms, result.pagination, 'Rooms retrieved');
  } catch (err) { next(err); }
};

const addRoom = async (req, res, next) => {
  try {
    const room = await adminService.addRoom(req.body, req.admin, req);
    ApiResponse.created(res, { room }, 'Room added successfully');
  } catch (err) { next(err); }
};

const updateRoomStatus = async (req, res, next) => {
  try {
    const room = await adminService.updateRoomStatus(req.params.id, req.body.status, req.admin, req);
    ApiResponse.success(res, { room }, 'Room status updated');
  } catch (err) { next(err); }
};

// ── Customers ─────────────────────────────────────────────────────────────

const listCustomers = async (req, res, next) => {
  try {
    const result = await adminService.listCustomers(req.query);
    ApiResponse.paginated(res, result.customers, result.pagination, 'Customers retrieved');
  } catch (err) { next(err); }
};

const awardPoints = async (req, res, next) => {
  try {
    const { points, reason } = req.body;
    const result = await adminService.awardPoints(req.params.id, points, reason, req.admin, req);
    ApiResponse.success(res, result, `${points} loyalty points awarded`);
  } catch (err) { next(err); }
};

// ── Payments ──────────────────────────────────────────────────────────────

const listTransactions = async (req, res, next) => {
  try {
    const result = await adminService.listTransactions(req.query);
    ApiResponse.paginated(res, result.transactions, result.pagination, 'Transactions retrieved');
  } catch (err) { next(err); }
};

// ── Refunds ───────────────────────────────────────────────────────────────

const listRefunds = async (req, res, next) => {
  try {
    const result = await adminService.listRefunds(req.query);
    ApiResponse.paginated(res, result.refunds, result.pagination, 'Refunds retrieved');
  } catch (err) { next(err); }
};

const approveRefund = async (req, res, next) => {
  try {
    const refund = await adminService.approveRefund(req.params.id, req.admin, req);
    ApiResponse.success(res, { refund }, 'Refund approved and dispatched');
  } catch (err) { next(err); }
};

const rejectRefund = async (req, res, next) => {
  try {
    const refund = await adminService.rejectRefund(req.params.id, req.admin, req);
    ApiResponse.success(res, { refund }, 'Refund rejected');
  } catch (err) { next(err); }
};

// ── Reviews ───────────────────────────────────────────────────────────────

const listReviews = async (req, res, next) => {
  try {
    const result = await require('../services/review.service').adminListReviews(req.query);
    ApiResponse.paginated(res, result.reviews, result.pagination, 'Reviews retrieved');
  } catch (err) { next(err); }
};

const respondToReview = async (req, res, next) => {
  try {
    const review = await adminService.adminRespondToReview(req.params.id, req.body.message, req.admin, req);
    ApiResponse.success(res, { review }, 'Response posted');
  } catch (err) { next(err); }
};

// ── Offers ────────────────────────────────────────────────────────────────

const listOffers = async (req, res, next) => {
  try {
    const result = await offerService.adminListOffers(req.query);
    ApiResponse.paginated(res, result.offers, result.pagination, 'Offers retrieved');
  } catch (err) { next(err); }
};

const createOffer = async (req, res, next) => {
  try {
    const offer = await offerService.createOffer(req.body);
    await adminService.writeAudit({
      admin: req.admin, action: 'OFFER_CREATED',
      entity: 'Offer', entityId: offer.offerId, req,
    });
    ApiResponse.created(res, { offer }, 'Offer created successfully');
  } catch (err) { next(err); }
};

const toggleOffer = async (req, res, next) => {
  try {
    const result = await adminService.adminToggleOffer(req.params.id, req.admin, req);
    ApiResponse.success(res, result, `Offer ${result.isActive ? 'activated' : 'deactivated'}`);
  } catch (err) { next(err); }
};

// ── Hotels ────────────────────────────────────────────────────────────────

const listHotels = async (req, res, next) => {
  try {
    const result = await hotelService.listAllHotels(req.query);
    ApiResponse.paginated(res, result.hotels, result.pagination, 'Hotels retrieved');
  } catch (err) { next(err); }
};

// ── Analytics ─────────────────────────────────────────────────────────────

const getAnalyticsOverview = async (req, res, next) => {
  try {
    const data = await adminService.getAnalyticsOverview(req.query, req.admin);
    ApiResponse.success(res, data, 'Analytics overview retrieved');
  } catch (err) { next(err); }
};

// ── Audit Logs ────────────────────────────────────────────────────────────

const listAuditLogs = async (req, res, next) => {
  try {
    const result = await adminService.listAuditLogs(req.query);
    ApiResponse.paginated(res, result.logs, result.pagination, 'Audit logs retrieved');
  } catch (err) { next(err); }
};

module.exports = {
  listBookings, updateBookingStatus, createWalkInBooking,
  listRooms, addRoom, updateRoomStatus,
  listCustomers, awardPoints,
  listTransactions,
  listRefunds, approveRefund, rejectRefund,
  listReviews, respondToReview,
  listOffers, createOffer, toggleOffer,
  listHotels,
  getAnalyticsOverview,
  listAuditLogs,
};
