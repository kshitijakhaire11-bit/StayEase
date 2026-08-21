const Offer = require('../models/Offer');
const ApiError = require('../utils/ApiError');

// ── Public: List active, non-expired offers ──────────────────────────────

const listActiveOffers = async ({ tier, page = 1, limit = 10 }) => {
  const today = new Date().toISOString().slice(0, 10);

  const filter = {
    isActive: true,
    validUntil: { $gte: today },
    validFrom:  { $lte: today },
  };

  if (tier) filter.applicableTier = { $in: [tier, null, undefined, ''] };

  const skip = (Number(page) - 1) * Number(limit);
  const [offers, total] = await Promise.all([
    Offer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Offer.countDocuments(filter),
  ]);

  return {
    offers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ── Public: Validate offer code at checkout ──────────────────────────────

const validateOfferCode = async ({ code, amount }) => {
  const today = new Date().toISOString().slice(0, 10);

  const offer = await Offer.findOne({ code: code.toUpperCase() });
  if (!offer) throw ApiError.notFound('Offer code not found');
  if (!offer.isActive) throw ApiError.badRequest('This offer is no longer active');
  if (offer.validUntil < today) throw ApiError.badRequest('This offer has expired');
  if (offer.validFrom > today) throw ApiError.badRequest('This offer is not yet valid');
  if (Number(amount) < offer.minSpend) {
    throw ApiError.badRequest(`Minimum spend of ₹${offer.minSpend} required for this offer`);
  }
  if (offer.usageCount >= offer.usageLimit) {
    throw ApiError.badRequest('This offer has reached its usage limit');
  }

  let discount = 0;
  if (offer.discountType === 'Percentage') {
    discount = Math.round(Number(amount) * offer.discountValue / 100);
    if (offer.maxDiscount) discount = Math.min(discount, offer.maxDiscount);
  } else {
    discount = offer.discountValue;
  }

  const finalAmount = Math.max(0, Number(amount) - discount);

  return {
    code: offer.code,
    title: offer.title,
    discountType: offer.discountType,
    discountValue: offer.discountValue,
    maxDiscount: offer.maxDiscount || null,
    discount,
    finalAmount,
  };
};

// ── Admin: List all offers (including inactive) ──────────────────────────

const adminListOffers = async ({ isActive, page = 1, limit = 10 }) => {
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true' || isActive === true;

  const skip = (Number(page) - 1) * Number(limit);
  const [offers, total] = await Promise.all([
    Offer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Offer.countDocuments(filter),
  ]);

  return {
    offers,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  };
};

// ── Admin: Create offer ──────────────────────────────────────────────────

const createOffer = async (data) => {
  const code = data.code.toUpperCase();
  const existing = await Offer.findOne({ code });
  if (existing) throw ApiError.conflict(`Offer code "${code}" already exists`);

  const offerId = `OFF-${Date.now()}`;
  const offer = await Offer.create({ ...data, offerId, code, usageCount: 0 });
  return offer;
};

// ── Admin: Toggle offer active state ────────────────────────────────────

const toggleOffer = async (id) => {
  const offer = await Offer.findById(id);
  if (!offer) throw ApiError.notFound('Offer not found');

  offer.isActive = !offer.isActive;
  await offer.save();
  return { id: offer._id, offerId: offer.offerId, code: offer.code, isActive: offer.isActive };
};

module.exports = { listActiveOffers, validateOfferCode, adminListOffers, createOffer, toggleOffer };
