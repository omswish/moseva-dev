// src/controllers/user.controller.js
const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// Get current logged-in user profile
exports.getMe = catchAsync(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// Update current logged-in user profile
exports.updateMe = catchAsync(async (req, res) => {
  const { username, email } = req.body;

  // Check unique constraints if updated
  if (username && username !== req.user.username) {
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      throw new ApiError(409, 'USERNAME_EXISTS', 'Username already taken');
    }
  }

  if (email && email !== req.user.email) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new ApiError(409, 'EMAIL_EXISTS', 'Email already registered');
    }
  }

  await req.user.update(req.body);
  res.json({ success: true, data: req.user });
});

// Upload and set user avatar
exports.uploadAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'NO_FILE', 'Please upload a valid image file');
  }

  // Build the local static URL dynamically
  const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

  await req.user.update({ avatarUrl });

  res.json({
    success: true,
    data: {
      avatarUrl
    }
  });
});
