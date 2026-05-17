// src/routes/notification.routes.js
const express = require('express');
const notificationController = require('../controllers/notification.controller');
const authenticate = require('../middleware/auth');

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:notificationId/read', notificationController.markAsRead);

module.exports = router;
