// src/controllers/rating.controller.js
const { Rating, Booking, Job, User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// Create or update review/rating for completed booking
exports.createRating = catchAsync(async (req, res) => {
  const { bookingId, patronRating, partnerRating, patronComment, partnerComment } = req.body;
  const userId = req.user.userId;
  const role = req.user.role;

  // Validate booking
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
  }

  if (booking.status !== 'completed') {
    throw new ApiError(400, 'BOOKING_NOT_COMPLETED', 'Only completed bookings can be rated');
  }

  // Auth: Must be patron or partner for this booking
  if (booking.patronId !== userId && booking.servicePartnerId !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'You are not authorized to rate this booking');
  }

  // Find or create Rating record
  let [rating, created] = await Rating.findOrCreate({
    where: { bookingId },
    defaults: {
      bookingId,
      jobId: booking.jobId,
      patronId: booking.patronId,
      servicePartnerId: booking.servicePartnerId
    }
  });

  // Apply ratings/comments based on who is calling
  if (role === 'patron' && booking.patronId === userId) {
    if (patronRating !== undefined) rating.patronRating = patronRating;
    if (patronComment !== undefined) rating.patronComment = patronComment;
  } else if (role === 'service_partner' && booking.servicePartnerId === userId) {
    if (partnerRating !== undefined) rating.partnerRating = partnerRating;
    if (partnerComment !== undefined) rating.partnerComment = partnerComment;
  } else {
    throw new ApiError(403, 'INVALID_RATER', 'Role mismatch for rating submission');
  }

  await rating.save();

  res.status(created ? 201 : 200).json({
    success: true,
    message: 'Rating submitted successfully',
    data: rating
  });
});

// Get ratings for a specific service partner
exports.getPartnerRatings = catchAsync(async (req, res) => {
  const { partnerId } = req.params;

  const ratings = await Rating.findAll({
    where: { servicePartnerId: partnerId },
    include: [
      { model: User, as: 'reviewer', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] },
      { model: Job, as: 'job', attributes: ['jobId', 'title'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json({ success: true, data: ratings });
});
