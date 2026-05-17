// src/middleware/validation.js
const ApiError = require('../utils/ApiError');

/**
 * Express middleware to validate request payload against Joi schema
 * @param {object} schema Joi schema containing body, query, or params validation rules
 */
module.exports = (schema) => (req, res, next) => {
  const validations = [];

  if (schema.body && req.body) {
    const { error, value } = schema.body.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      validations.push(...error.details.map(d => d.message));
    } else {
      req.body = value; // update with stripped/sanitized value
    }
  }

  if (schema.query && req.query) {
    const { error, value } = schema.query.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error) {
      validations.push(...error.details.map(d => d.message));
    } else {
      req.query = value;
    }
  }

  if (schema.params && req.params) {
    const { error, value } = schema.params.validate(req.params, { abortEarly: false, stripUnknown: true });
    if (error) {
      validations.push(...error.details.map(d => d.message));
    } else {
      req.params = value;
    }
  }

  if (validations.length > 0) {
    const errorMessage = validations.join(', ');
    return next(new ApiError(400, 'VALIDATION_ERROR', errorMessage));
  }

  next();
};
