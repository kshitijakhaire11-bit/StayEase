const bookingService = require('../services/booking.service');
const ApiResponse = require('../utils/ApiResponse');

const createBooking = async (req, res, next) => {
  try {
    const result = await bookingService.createBooking(req.user, req.body);
    ApiResponse.created(res, result, 'Booking confirmed successfully');
  } catch (err) {
    next(err);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getUserBookings(req.user._id, req.query);
    ApiResponse.paginated(res, result.bookings, result.pagination, 'Bookings retrieved');
  } catch (err) {
    next(err);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.bookingId, req.user._id, false);
    ApiResponse.success(res, { booking }, 'Booking retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, getMyBookings, getBooking };
