// src/routes/rating.routes.js
const express = require('express');
const ratingController = require('../controllers/rating.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const ratingValidator = require('../validators/rating.validator');

const router = express.Router();

// Public route to view a service partner's ratings/reviews
router.get('/partner/:partnerId', ratingController.getPartnerRatings);

// Protected route to submit a rating/review
router.post(
  '/',
  authenticate,
  validate(ratingValidator.createRating),
  ratingController.createRating
);

module.exports = router;
