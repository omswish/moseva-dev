// src/validators/auth.validator.js
const Joi = require('joi');

const register = {
  body: Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9_.]+$/).min(3).max(30).required().messages({
      'string.pattern.base': 'Username can only contain letters, numbers, underscores, and dots'
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
    role: Joi.string().valid('steward', 'patron', 'service_partner').default('patron'),
    firstName: Joi.string().max(100).allow('', null),
    lastName: Joi.string().max(100).allow('', null),
    phone: Joi.string().max(20).allow('', null),
    avatarUrl: Joi.string().max(500).allow('', null),
    bio: Joi.string().allow('', null)
  })
};

const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const refresh = {
  body: Joi.object({
    refreshToken: Joi.string().required()
  })
};

module.exports = {
  register,
  login,
  refresh
};
