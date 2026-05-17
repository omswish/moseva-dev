// src/utils/ApiError.js
class ApiError extends Error {
  /**
   * @param {number} statusCode HTTP status code
   * @param {string} code Application-specific error code
   * @param {string} message Human readable message
   */
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
