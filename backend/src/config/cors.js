// src/config/cors.js
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) 
  : ['http://localhost:3000', 'http://localhost:5173'];

module.exports = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman, or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in the allowed list or if wildcard is set
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*') || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
