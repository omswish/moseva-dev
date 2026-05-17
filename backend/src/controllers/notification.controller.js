// src/controllers/notification.controller.js
const { Notification } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// Get all notifications for current user
exports.getNotifications = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const notifications = await Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });

  res.json({ success: true, data: notifications });
});

// Mark single notification as read
exports.markAsRead = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.userId;

  const notification = await Notification.findByPk(notificationId);
  if (!notification) {
    throw new ApiError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found');
  }

  if (notification.userId !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'Access denied to this notification');
  }

  await notification.update({ isRead: true });

  res.json({ success: true, data: notification });
});

// Mark all user notifications as read
exports.markAllAsRead = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  await Notification.update(
    { isRead: true },
    { where: { userId, isRead: false } }
  );

  res.json({ success: true, message: 'All notifications marked as read successfully' });
});
