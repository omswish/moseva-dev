// src/validators/rating.validator.js
const Joi = require('joi');

const createRating = {
  body: Joi.object({
    bookingId: Joi.string().uuid().required(),
    // Let Joi allow either patronRating or partnerRating depending on who is rating,
    // but at least one rating should be provided
    patronRating: Joi.number().integer().min(1).max(5),
    partnerRating: Joi.number().integer().min(1).max(5),
    patronComment: Joi.string().allow('', null),
    partnerComment: Joi.string().allow('', null)
  }).or('patronRating', 'partnerRating')
};

module.exports = {
  createRating
};
