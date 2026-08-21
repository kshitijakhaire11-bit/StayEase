const express = require('express');
const router = express.Router();
const controller = require('../controllers/offer.controller');
const validate = require('../middlewares/validate.middleware');
const { validateOfferCodeValidator, createOfferValidator } = require('../validators/offer.validators');

// Public
router.get('/', controller.listOffers);
router.post('/validate', validateOfferCodeValidator, validate, controller.validateCode);

module.exports = router;
