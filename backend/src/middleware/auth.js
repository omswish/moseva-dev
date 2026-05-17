// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'NO_TOKEN', 'No token provided');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'USER_NOT_FOUND', 'User not found or inactive');
    }
    req.user = user; // attach full Sequelize instance
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'TOKEN_EXPIRED', 'Token expired'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'INVALID_TOKEN', 'Invalid token'));
    }
    next(err);
  }
};

/**
 * Middleware to authorize access based on roles
 * @param {...string} allowedRoles Allowed user roles
 */
authenticate.authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'UNAUTHORIZED', 'Authentication required'));
  }
  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'FORBIDDEN', 'Insufficient permissions'));
  }
  next();
};

module.exports = authenticate;
