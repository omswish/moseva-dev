// src/validators/booking.validator.js
const Joi = require('joi');

const createBooking = {
  body: Joi.object({
    jobId: Joi.string().uuid().required(),
    proposalText: Joi.string().min(10).required(),
    proposedPrice: Joi.number().precision(2).positive().required(),
    proposedTimeline: Joi.number().integer().positive().required() // in days
  })
};

const cancelBooking = {
  body: Joi.object({
    cancellationReason: Joi.string().min(5).required()
  })
};

module.exports = {
  createBooking,
  cancelBooking
};
