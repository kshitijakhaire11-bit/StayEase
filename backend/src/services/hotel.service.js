const Hotel = require('../models/Hotel');
const ApiError = require('../utils/ApiError');

// ── Public: List / Search Hotels ──────────────────────────────────────────

const listHotels = async ({ city, minPrice, maxPrice, minRating, amenities, page = 1, limit = 10 }) => {
  const filter = { isActive: true };

  if (city) {
    filter.$or = [
      { city: { $regex: city, $options: 'i' } },
      { state: { $regex: city, $options: 'i' } },
      { name: { $regex: city, $options: 'i' } },
      { location: { $regex: city, $options: 'i' } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.pricePerNight = {};
    if (minPrice !== undefined) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.pricePerNight.$lte = Number(maxPrice);
  }

  if (minRating !== undefined) {
    filter.rating = { $gte: Number(minRating) };
  }

  if (amenities) {
    const amenityList = amenities.split(',').map((a) => a.trim()).filter(Boolean);
    if (amenityList.length > 0) {
      filter.amenities = { $all: amenityList };
    }
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [hotels, total] = await Promise.all([
    Hotel.find(filter).sort({ rating: -1, pricePerNight: 1 }).skip(skip).limit(Number(limit)),
    Hotel.countDocuments(filter),
  ]);

  return {
    hotels,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ── Public: Get Hotel by hotelId ───────────────────────────────────────────

const getHotelById = async (hotelId) => {
  const hotel = await Hotel.findOne({ hotelId, isActive: true });
  if (!hotel) throw ApiError.notFound('Hotel not found');
  return hotel;
};

// ── Admin: Create Hotel ────────────────────────────────────────────────────

const createHotel = async (data) => {
  const existing = await Hotel.findOne({ hotelId: data.hotelId });
  if (existing) throw ApiError.conflict('A hotel with this ID already exists');
  const hotel = await Hotel.create(data);
  return hotel;
};

// ── Admin: Update Hotel ────────────────────────────────────────────────────

const updateHotel = async (hotelId, updates, adminRole, hotelAccess) => {
  const hotel = await Hotel.findOne({ hotelId });
  if (!hotel) throw ApiError.notFound('Hotel not found');

  // hotel_owner can only update their own hotel
  if (adminRole === 'hotel_owner' && hotelAccess !== 'all' && hotelAccess !== hotelId) {
    throw ApiError.forbidden('You can only update your assigned hotel');
  }

  // Prevent hotelId from being changed
  delete updates.hotelId;

  Object.assign(hotel, updates);
  await hotel.save();
  return hotel;
};

// ── Admin: List All Hotels (including inactive) ────────────────────────────

const listAllHotels = async ({ page = 1, limit = 20 }) => {
  const skip = (Number(page) - 1) * Number(limit);
  const [hotels, total] = await Promise.all([
    Hotel.find().sort({ name: 1 }).skip(skip).limit(Number(limit)),
    Hotel.countDocuments(),
  ]);
  return { hotels, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
};

module.exports = { listHotels, getHotelById, createHotel, updateHotel, listAllHotels };
