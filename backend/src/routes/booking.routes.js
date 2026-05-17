// src/routes/booking.routes.js
const express = require('express');
const bookingController = require('../controllers/booking.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const bookingValidator = require('../validators/booking.validator');

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

router.get('/', bookingController.getBookings);
router.get('/:bookingId', bookingController.getBookingById);

router.post(
  '/',
  validate(bookingValidator.createBooking),
  bookingController.createBooking
);

router.put('/:bookingId/accept', bookingController.acceptBooking);
router.put('/:bookingId/reject', bookingController.rejectBooking);
router.put('/:bookingId/complete', bookingController.completeBooking);

router.put(
  '/:bookingId/cancel',
  validate(bookingValidator.cancelBooking),
  bookingController.cancelBooking
);

module.exports = router;
