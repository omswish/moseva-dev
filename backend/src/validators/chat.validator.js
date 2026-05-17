// src/validators/chat.validator.js
const Joi = require('joi');

const createConversation = {
  body: Joi.object({
    participant2Id: Joi.string().uuid().required(),
    bookingId: Joi.string().uuid().allow('', null)
  })
};

module.exports = {
  createConversation
};
