// src/validators/job.validator.js
const Joi = require('joi');

const createJob = {
  body: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).required(),
    categoryId: Joi.string().uuid().required(),
    budgetMin: Joi.number().precision(2).min(0).allow('', null),
    budgetMax: Joi.number().precision(2).min(Joi.ref('budgetMin')).allow('', null),
    location: Joi.string().max(200).allow('', null),
    locationType: Joi.string().valid('onsite', 'remote', 'flexible').default('flexible'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    deadline: Joi.date().iso().greater('now').allow('', null)
  })
};

const updateJob = {
  body: Joi.object({
    title: Joi.string().min(5).max(200),
    description: Joi.string().min(10),
    categoryId: Joi.string().uuid(),
    budgetMin: Joi.number().precision(2).min(0).allow('', null),
    budgetMax: Joi.number().precision(2).min(0).allow('', null),
    location: Joi.string().max(200).allow('', null),
    locationType: Joi.string().valid('onsite', 'remote', 'flexible'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    deadline: Joi.date().iso().greater('now').allow('', null),
    status: Joi.string().valid('draft', 'pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled')
  })
};

const listJobs = {
  query: Joi.object({
    categoryId: Joi.string().uuid(),
    status: Joi.string().valid('draft', 'pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'),
    locationType: Joi.string().valid('onsite', 'remote', 'flexible'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    search: Joi.string().max(100),
    budgetMin: Joi.number().min(0),
    budgetMax: Joi.number().min(0),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  })
};

module.exports = {
  createJob,
  updateJob,
  listJobs
};
