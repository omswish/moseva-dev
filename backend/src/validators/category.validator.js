// src/validators/category.validator.js
const Joi = require('joi');

const createCategory = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().allow('', null),
    parentId: Joi.string().uuid().allow('', null),
    iconUrl: Joi.string().max(500).allow('', null),
    displayOrder: Joi.number().integer().min(0).default(0)
  })
};

const updateCategory = {
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().allow('', null),
    parentId: Joi.string().uuid().allow('', null),
    iconUrl: Joi.string().max(500).allow('', null),
    displayOrder: Joi.number().integer().min(0),
    isActive: Joi.boolean()
  })
};

module.exports = {
  createCategory,
  updateCategory
};
