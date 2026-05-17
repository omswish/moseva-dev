// src/validators/user.validator.js
const Joi = require('joi');

const updateMe = {
  body: Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    firstName: Joi.string().max(100).allow('', null),
    lastName: Joi.string().max(100).allow('', null),
    phone: Joi.string().max(20).allow('', null),
    bio: Joi.string().allow('', null)
  })
};

module.exports = {
  updateMe
};
