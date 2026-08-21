const hotelService = require('../services/hotel.service');
const ApiResponse = require('../utils/ApiResponse');

const listHotels = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice, minRating, amenities, page, limit } = req.query;
    const result = await hotelService.listHotels({ city, minPrice, maxPrice, minRating, amenities, page, limit });
    ApiResponse.paginated(res, result.hotels, result.pagination, 'Hotels retrieved');
  } catch (err) {
    next(err);
  }
};

const getHotel = async (req, res, next) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.hotelId);
    ApiResponse.success(res, { hotel }, 'Hotel retrieved');
  } catch (err) {
    next(err);
  }
};

const createHotel = async (req, res, next) => {
  try {
    const hotel = await hotelService.createHotel(req.body);
    ApiResponse.created(res, { hotel }, 'Hotel created successfully');
  } catch (err) {
    next(err);
  }
};

const updateHotel = async (req, res, next) => {
  try {
    const hotel = await hotelService.updateHotel(
      req.params.hotelId,
      req.body,
      req.admin.role,
      req.admin.hotelAccess
    );
    ApiResponse.success(res, { hotel }, 'Hotel updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { listHotels, getHotel, createHotel, updateHotel };
