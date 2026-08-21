const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const { protectAdmin, requireRole } = require('../middlewares/adminAuth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  addRoomValidator,
  updateRoomStatusValidator,
  awardPointsValidator,
  createHotelValidator,
  gmRespondAdminValidator,
} = require('../validators/admin.validators');
const { createBookingValidator, updateBookingStatusValidator } = require('../validators/booking.validators');
const { createOfferValidator } = require('../validators/offer.validators');

// All admin routes require admin JWT
router.use(protectAdmin);

// ── Bookings ──────────────────────────────────────────────────────────────
router.get('/bookings', ctrl.listBookings);
router.post('/bookings', requireRole('super_admin', 'hotel_owner', 'operations'), createBookingValidator, validate, ctrl.createWalkInBooking);
router.patch('/bookings/:id/status', requireRole('super_admin', 'hotel_owner', 'operations'), updateBookingStatusValidator, validate, ctrl.updateBookingStatus);

// ── Rooms ─────────────────────────────────────────────────────────────────
router.get('/rooms', ctrl.listRooms);
router.post('/rooms', requireRole('super_admin', 'hotel_owner'), addRoomValidator, validate, ctrl.addRoom);
router.patch('/rooms/:id/status', requireRole('super_admin', 'hotel_owner', 'operations'), updateRoomStatusValidator, validate, ctrl.updateRoomStatus);

// ── Customers ─────────────────────────────────────────────────────────────
router.get('/customers', ctrl.listCustomers);
router.patch('/customers/:id/points', requireRole('super_admin', 'support_agent'), awardPointsValidator, validate, ctrl.awardPoints);

// ── Payments ──────────────────────────────────────────────────────────────
router.get('/payments', ctrl.listTransactions);

// ── Refunds ───────────────────────────────────────────────────────────────
router.get('/refunds', ctrl.listRefunds);
router.patch('/refunds/:id/approve', requireRole('super_admin', 'support_agent'), ctrl.approveRefund);
router.patch('/refunds/:id/reject',  requireRole('super_admin', 'support_agent'), ctrl.rejectRefund);

// ── Reviews ───────────────────────────────────────────────────────────────
router.get('/reviews', ctrl.listReviews);
router.patch('/reviews/:id/respond', requireRole('super_admin', 'hotel_owner'), gmRespondAdminValidator, validate, ctrl.respondToReview);

// ── Offers ────────────────────────────────────────────────────────────────
router.get('/offers', ctrl.listOffers);
router.post('/offers', requireRole('super_admin', 'hotel_owner'), createOfferValidator, validate, ctrl.createOffer);
router.patch('/offers/:id/toggle', requireRole('super_admin', 'hotel_owner'), ctrl.toggleOffer);

// ── Hotels ────────────────────────────────────────────────────────────────
router.get('/hotels', ctrl.listHotels);

// ── Analytics ─────────────────────────────────────────────────────────────
router.get('/analytics/overview', ctrl.getAnalyticsOverview);

// ── Audit Logs ────────────────────────────────────────────────────────────
router.get('/audit-logs', requireRole('super_admin'), ctrl.listAuditLogs);

module.exports = router;
