const offerService = require('../services/offer.service');
const ApiResponse  = require('../utils/ApiResponse');

const listOffers = async (req, res, next) => {
  try {
    const result = await offerService.listActiveOffers(req.query);
    ApiResponse.paginated(res, result.offers, result.pagination, 'Offers retrieved');
  } catch (err) { next(err); }
};

const validateCode = async (req, res, next) => {
  try {
    const result = await offerService.validateOfferCode(req.body);
    ApiResponse.success(res, result, 'Offer code is valid');
  } catch (err) { next(err); }
};

module.exports = { listOffers, validateCode };
