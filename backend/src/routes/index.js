// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import individual route modules
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const userRoutes = require('./user.routes');
const jobRoutes = require('./job.routes');
const bookingRoutes = require('./booking.routes');
const ratingRoutes = require('./rating.routes');
const chatRoutes = require('./chat.routes');
const notificationRoutes = require('./notification.routes');
const adminRoutes = require('./admin.routes');
const feedbackRoutes = require('./feedback.routes');
const dpdpRoutes = require('./dpdp.routes');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/bookings', bookingRoutes);
router.use('/ratings', ratingRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/dpdp', dpdpRoutes);

module.exports = router;
