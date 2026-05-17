# Backend Architecture

## Overview
This document outlines the backend architecture for the service marketplace application built with Node.js and Express. The architecture follows RESTful principles with a focus on scalability, security, and maintainability.

## Technology Stack

### Core Technologies
- **Node.js**: JavaScript runtime
- **Express.js v5**: Web framework
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for database operations
- **Socket.IO**: Real-time communication
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Joi**: Data validation
- **Winston**: Logging

### Security & Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **express-rate-limit**: Rate limiting
- **express-validator**: Input validation
- **cookie-parser**: Cookie handling
- **compression**: Response compression

### Development & Testing
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **nodemon**: Auto-reload during development

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── index.js              # Main config
│   │   ├── database.js           # Database configuration
│   │   ├── env.js                # Environment variables
│   │   ├── cors.js               # CORS configuration
│   │   └── socket.js             # Socket.IO configuration
│   ├── models/                   # Database models
│   │   ├── index.js              # Model exports
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Booking.js
│   │   ├── Rating.js
│   │   ├── Category.js
│   │   ├── Message.js
│   │   ├── Conversation.js
│   │   ├── RefreshToken.js
│   │   └── Notification.js
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── job.controller.js
│   │   ├── booking.controller.js
│   │   ├── rating.controller.js
│   │   ├── category.controller.js
│   │   ├── chat.controller.js
│   │   ├── notification.controller.js
│   │   └── admin.controller.js
│   ├── services/                 # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── job.service.js
│   │   ├── booking.service.js
│   │   ├── rating.service.js
│   │   ├── category.service.js
│   │   ├── chat.service.js
│   │   ├── notification.service.js
│   │   ├── email.service.js
│   │   └── file.service.js
│   ├── routes/                   # API routes
│   │   ├── index.js              # Main router
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── job.routes.js
│   │   ├── booking.routes.js
│   │   ├── rating.routes.js
│   │   ├── category.routes.js
│   │   ├── chat.routes.js
│   │   ├── notification.routes.js
│   │   └── admin.routes.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # Authentication middleware
│   │   ├── authorize.js          # Authorization middleware
│   │   ├── validation.js         # Request validation
│   │   ├── errorHandler.js       # Error handling
│   │   ├── rateLimiter.js        # Rate limiting
│   │   ├── fileUpload.js         # File upload handling
│   │   └── logger.js             # Request logging
│   ├── validators/               # Joi validation schemas
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── job.validator.js
│   │   ├── booking.validator.js
│   │   └── rating.validator.js
│   ├── utils/                    # Utility functions
│   │   ├── ApiError.js           # Custom error class
│   │   ├── catchAsync.js         # Async wrapper
│   │   ├── pick.js               # Object property picker
│   │   ├── pagination.js         # Pagination helper
│   │   ├── emailTemplates.js     # Email templates
│   │   └── helpers.js            # General helpers
│   ├── events/                   # Event handlers
│   │   ├── chat.events.js        # Chat event handlers
│   │   ├── notification.events.js # Notification events
│   │   └── booking.events.js     # Booking events
│   ├── jobs/                     # Background jobs (if using queue)
│   │   └── emailQueue.js
│   └── app.js                    # Express app setup
├── tests/
│   ├── fixtures/                 # Test data
│   ├── integration/              # Integration tests
│   ├── unit/                     # Unit tests
│   └── setup.js                  # Test setup
├── migrations/                   # Database migrations
│   ├── 20240101000001-create-users.js
│   ├── 20240101000002-create-categories.js
│   ├── 20240101000003-create-jobs.js
│   └── ...
├── seeders/                      # Database seeders
│   ├── 20240101000001-seed-users.js
│   ├── 20240101000002-seed-categories.js
│   └── ...
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── jest.config.js
├── package.json
├── server.js                     # Entry point
└── README.md
```

## Application Entry Point

```javascript
// server.js
require('dotenv').config();
const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');
const { initializeSocket } = require('./src/config/socket');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000; // Standardised for localhost college project to prevent port clashes

// Connect to database
connectDatabase();

// Create HTTP server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Initialize Socket.IO
initializeSocket(server);

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  server.close(() => process.exit(1));
});
```

```javascript
// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path'); // Added for local static files path resolution

const corsOptions = require('./config/cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local media in browser during local development
}));
app.use(cors(corsOptions));
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static folder serving for local file uploads (Multer)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting (configured higher in development to facilitate fast manual testing clicks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : 100, // higher limit in local dev
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests' } }
});
app.use('/api/', limiter);

// Request logging
app.use(logger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.originalUrl} not found` }
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
```

## Database Models

```javascript
// src/models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'user_id'
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash'
  },
  role: {
    type: DataTypes.ENUM('steward', 'patron', 'service_partner'),
    defaultValue: 'patron',
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(100),
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    field: 'last_name'
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    field: 'avatar_url'
  },
  bio: {
    type: DataTypes.TEXT
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.passwordHash) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('passwordHash')) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
      }
    }
  }
});

// Instance methods
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.passwordHash;
  return values;
};

User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = User;
```

```javascript
// src/models/Job.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  jobId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'job_id'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'category_id',
    references: {
      model: 'categories',
      key: 'category_id'
    }
  },
  patronId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'patron_id',
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  budgetMin: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'budget_min'
  },
  budgetMax: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'budget_max'
  },
  location: {
    type: DataTypes.STRING(200)
  },
  locationType: {
    type: DataTypes.ENUM('onsite', 'remote', 'flexible'),
    defaultValue: 'flexible',
    field: 'location_type'
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  deadline: {
    type: DataTypes.DATEONLY
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    field: 'rejection_reason'
  },
  viewedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'viewed_count'
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Job;
```

## Services Layer

```javascript
// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');

class AuthService {
  async register(userData) {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new ApiError(409, 'EMAIL_EXISTS', 'Email already registered');
    }

    // Create user
    const user = await User.create({
      ...userData,
      passwordHash: userData.password // Will be hashed by model hook
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.userId);

    return { user, ...tokens };
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'USER_INACTIVE', 'Account is deactivated');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user, ...tokens };
  }

  async refreshToken(refreshToken) {
    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Find valid refresh token
    const tokenRecord = await RefreshToken.findOne({
      where: {
        tokenHash: hashedToken,
        expiresAt: { [Op.gt]: new Date() },
        isRevoked: false
      },
      include: [User]
    });

    if (!tokenRecord) {
      throw new ApiError(401, 'INVALID_TOKEN', 'Invalid refresh token');
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(tokenRecord.User);

    return { accessToken };
  }

  async logout(refreshToken) {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    await RefreshToken.update(
      { isRevoked: true },
      { where: { tokenHash: hashedToken } }
    );
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
    );
  }

  generateRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  async generateTokens(user) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Store refresh token
    await RefreshToken.create({
      userId: user.userId,
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return {
      accessToken,
      refreshToken
    };
  }
}

module.exports = new AuthService();
```

## Controllers

```javascript
// src/controllers/job.controller.js
const jobService = require('../services/job.service');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { jobFilters } = require('../validators/job.validator');

const createJob = catchAsync(async (req, res) => {
  const job = await jobService.createJob(req.user.userId, req.body);
  res.status(201).json({ success: true, data: job });
});

const getJobs = catchAsync(async (req, res) => {
  const filters = pick(req.query, jobFilters);
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const result = await jobService.queryJobs(filters, options);
  res.json({ success: true, ...result });
});

const getJob = catchAsync(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  res.json({ success: true, data: job });
});

const updateJob = catchAsync(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.body);
  res.json({ success: true, data: job });
});

const deleteJob = catchAsync(async (req, res) => {
  await jobService.deleteJob(req.params.id);
  res.status(204).send();
});

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob
};
```

## Routes

```javascript
// src/routes/job.routes.js
const express = require('express');
const jobController = require('../controllers/job.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validation');
const { createJobSchema, updateJobSchema } = require('../validators/job.validator');

const router = express.Router();

// Public routes (approved jobs only)
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJob);

// Protected routes
router.use(auth);

// Patron-only routes
router.post('/', authorize('patron'), validate(createJobSchema), jobController.createJob);
router.put('/:id', authorize('patron'), validate(updateJobSchema), jobController.updateJob);
router.delete('/:id', authorize('patron'), jobController.deleteJob);
router.get('/my-jobs', authorize('patron'), jobController.getMyJobs);

module.exports = router;
```

```javascript
// src/routes/index.js
const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const jobRoutes = require('./job.routes');
const bookingRoutes = require('./booking.routes');
const ratingRoutes = require('./rating.routes');
const categoryRoutes = require('./category.routes');
const chatRoutes = require('./chat.routes');
const notificationRoutes = require('./notification.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/bookings', bookingRoutes);
router.use('/ratings', ratingRoutes);
router.use('/categories', categoryRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
```

## Middleware

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const auth = catchAsync(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'NO_TOKEN', 'No token provided');
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // Check if user still exists
  const user = await User.findByPk(decoded.userId);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'USER_NOT_FOUND', 'User not found');
  }

  // Attach user to request
  req.user = user;
  next();
});

module.exports = auth;
```

```javascript
// src/middleware/authorize.js
const ApiError = require('../utils/ApiError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'FORBIDDEN', 'Insufficient permissions');
    }
    next();
  };
};

module.exports = authorize;
```

```javascript
// src/middleware/errorHandler.js
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message, code } = err;

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = err.errors.map(e => e.message).join(', ');
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    code = 'CONFLICT';
    message = 'Resource already exists';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid token';
  }

  // Send response
  res.status(statusCode || 500).json({
    success: false,
    error: {
      code: code || 'INTERNAL_ERROR',
      message: message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
```

## Validation

```javascript
// src/validators/job.validator.js
const Joi = require('joi');

const createJobSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).required(),
  categoryId: Joi.string().uuid().required(),
  budgetMin: Joi.number().positive().optional(),
  budgetMax: Joi.number().positive().greater(Joi.ref('budgetMin')).optional(),
  location: Joi.string().max(200).optional(),
  locationType: Joi.string().valid('onsite', 'remote', 'flexible').default('flexible'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  deadline: Joi.date().greater('now').optional()
});

const updateJobSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  description: Joi.string().min(20).optional(),
  categoryId: Joi.string().uuid().optional(),
  budgetMin: Joi.number().positive().optional(),
  budgetMax: Joi.number().positive().optional(),
  location: Joi.string().max(200).optional(),
  locationType: Joi.string().valid('onsite', 'remote', 'flexible').optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  deadline: Joi.date().greater('now').optional()
});

const jobFilters = ['category', 'status', 'location', 'locationType', 'minBudget', 'maxBudget', 'priority', 'search', 'sortBy', 'sortOrder'];

module.exports = {
  createJobSchema,
  updateJobSchema,
  jobFilters
};
```

## Socket.IO Configuration

```javascript
// src/config/socket.js
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const chatService = require('../services/chat.service');
const notificationService = require('../services/notification.service');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Chat events
    socket.on('chat:message', async (data, callback) => {
      try {
        const message = await chatService.sendMessage({
          conversationId: data.conversationId,
          senderId: socket.userId,
          content: data.content,
          messageType: data.messageType || 'text'
        });

        // Broadcast to conversation participants
        io.to(`conversation:${data.conversationId}`).emit('chat:message', message);
        
        if (callback) callback({ success: true, data: message });
      } catch (error) {
        if (callback) callback({ success: false, error: error.message });
      }
    });

    socket.on('chat:typing', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('chat:typing', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    });

    socket.on('chat:read', (data) => {
      chatService.markAsRead(data.conversationId, socket.userId);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
```

## Error Handling

```javascript
// src/utils/ApiError.js
class ApiError extends Error {
  constructor(statusCode, code, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
```

```javascript
// src/utils/catchAsync.js
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
```

## Logging

```javascript
// src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

module.exports = logger;
```

## Environment Configuration

```env
# .env
NODE_ENV=development
PORT=5000 # Backend API standard port (avoids collision with React frontend running on port 3000)

# Database (Local PostgreSQL Setup)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_marketplace
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password

# JWT (HS256 Symmetric Encryption Secrets)
ACCESS_TOKEN_SECRET=your_access_token_secret_min_32_chars_long
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_chars_long
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (Optional/Mocked in Local Dev - Bypassed/Logged to console when NODE_ENV=development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=optional_user@gmail.com
SMTP_PASS=optional_app_password
EMAIL_FROM=noreply@servicemarketplace.com

# CORS (CORS configuration allows communication from React Frontend on port 3000)
ALLOWED_ORIGINS=http://localhost:3000

# Rate Limiting (Higher limits applied automatically in development mode)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10000

# File Upload (Files are saved in backend/uploads/ and served as static resources)
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# Logging
LOG_LEVEL=debug
```

## Testing

```javascript
// tests/unit/auth.service.test.js
const AuthService = require('../../src/services/auth.service');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');
jest.mock('jsonwebtoken');
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from('mocktoken', 'hex')),
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('hashedtoken')
  })
}));

describe('AuthService', () => {
  describe('register', () => {
    it('should create user and return tokens', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        userId: '123',
        email: 'test@example.com',
        role: 'patron'
      });

      const result = await AuthService.register({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        role: 'patron'
      });

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error if email exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(AuthService.register({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('EMAIL_EXISTS');
    });
  });
});
```

## Deployment

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=service_marketplace
      - DB_USER=postgres
      - DB_PASSWORD=postgres
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=service_marketplace
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'service-marketplace-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-err.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true
  }]
};
```

## Performance Optimizations

### Database Indexing
```sql
-- Critical indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_status_created ON jobs(status, created_at DESC);
CREATE INDEX idx_jobs_category ON jobs(category_id);
CREATE INDEX idx_bookings_job ON bookings(job_id);
CREATE INDEX idx_messages_conversation_sent ON messages(conversation_id, sent_at DESC);
```

### Caching Strategy
```javascript
// NOTE: For this localhost college project, Redis caching is OPTIONAL and disabled by default to simplify local installation.
// If Redis is not installed/running locally, direct database queries via Sequelize are executed.
//
// const redis = require('redis');
// const client = redis.createClient();
// 
// const cacheMiddleware = (duration) => async (req, res, next) => {
//   const key = `cache:${req.originalUrl}`;
//   
//   try {
//     const cachedData = await client.get(key);
//     if (cachedData) {
//       return res.json(JSON.parse(cachedData));
//     }
// 
//     res.originalJson = res.json;
//     res.json = async (body) => {
//       await client.setEx(key, duration, JSON.stringify(body));
//       res.originalJson(body);
//     };
//   } catch (err) {
//     console.warn('Redis not running, bypassing cache:', err.message);
//   }
//   next();
// };
```

## Monitoring & Health Checks

```javascript
// Health check endpoint with detailed status
router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'unknown',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };

  try {
    await sequelize.query('SELECT 1');
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'degraded';
  }

  res.status(health.status === 'ok' ? 200 : 503).json(health);
});