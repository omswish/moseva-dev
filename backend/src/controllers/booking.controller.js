// src/controllers/booking.controller.js
const { Booking, Job, User } = require('../models');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// Get list of bookings for current user
exports.getBookings = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const role = req.user.role;

  let whereClause = {};
  if (role === 'patron') {
    whereClause.patronId = userId;
  } else if (role === 'service_partner') {
    whereClause.servicePartnerId = userId;
  }
  // Stewards can view all bookings

  const bookings = await Booking.findAll({
    where: whereClause,
    include: [
      { model: Job, as: 'job', attributes: ['jobId', 'title', 'status', 'budgetMin', 'budgetMax'] },
      { model: User, as: 'patron', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] },
      { model: User, as: 'servicePartner', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json({ success: true, data: bookings });
});

// Get specific booking details
exports.getBookingById = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.userId;
  const role = req.user.role;

  const booking = await Booking.findByPk(bookingId, {
    include: [
      { model: Job, as: 'job' },
      { model: User, as: 'patron', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] },
      { model: User, as: 'servicePartner', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] }
    ]
  });

  if (!booking) {
    throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
  }

  // Auth check: Patron, partner, or steward
  if (role !== 'steward' && booking.patronId !== userId && booking.servicePartnerId !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'Access denied to this booking');
  }

  res.json({ success: true, data: booking });
});

// Service Partner only: Apply for an approved job
exports.createBooking = catchAsync(async (req, res) => {
  if (req.user.role !== 'service_partner') {
    throw new ApiError(403, 'FORBIDDEN_ROLE', 'Only Service Partners can apply for jobs');
  }

  const { jobId, proposalText, proposedPrice, proposedTimeline } = req.body;

  // Validate job post
  const job = await Job.findByPk(jobId);
  if (!job) {
    throw new ApiError(404, 'JOB_NOT_FOUND', 'Job post not found');
  }

  if (job.status !== 'approved') {
    throw new ApiError(400, 'JOB_NOT_APPROVED', 'This job post is not open for applications');
  }

  // Check if partner already applied
  const existingApplication = await Booking.findOne({
    where: {
      jobId,
      servicePartnerId: req.user.userId,
      status: { [Op.ne]: 'rejected' }
    }
  });

  if (existingApplication) {
    throw new ApiError(400, 'APPLICATION_EXISTS', 'You already have an active application for this job');
  }

  // Create the booking application
  const booking = await Booking.create({
    jobId,
    servicePartnerId: req.user.userId,
    patronId: job.patronId,
    proposalText,
    proposedPrice,
    proposedTimeline,
    status: 'pending'
  });

  res.status(201).json({ success: true, data: booking });
});

// Patron Owner: Accept application
exports.acceptBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
  }

  if (booking.patronId !== req.user.userId) {
    throw new ApiError(403, 'FORBIDDEN', 'You do not own the job associated with this booking');
  }

  if (booking.status !== 'pending') {
    throw new ApiError(400, 'INVALID_STATUS', `Booking is already ${booking.status}`);
  }

  // Accept this booking
  await booking.update({
    status: 'accepted',
    startDate: new Date()
  });

  // Set the job status to 'in_progress'
  await Job.update({ status: 'in_progress' }, { where: { jobId: booking.jobId } });

  // Automatically reject all other pending applications for this job
  await Booking.update(
    { status: 'rejected' },
    {
      where: {
        jobId: booking.jobId,
        status: 'pending',
        bookingId: { [Op.ne]: bookingId }
      }
    }
  );

  res.json({ success: true, message: 'Application accepted successfully', data: booking });
});

// Patron Owner: Reject application
exports.rejectBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
  }

  if (booking.patronId !== req.user.userId) {
    throw new ApiError(403, 'FORBIDDEN', 'You do not own the job associated with this booking');
  }

  if (booking.status !== 'pending') {
    throw new ApiError(400, 'INVALID_STATUS', `Booking is already ${booking.status}`);
  }

  await booking.update({ status: 'rejected' });
  res.json({ success: true, message: 'Application rejected successfully', data: booking });
});

// Complete booking
exports.completeBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
  }

  // Only patron or service partner can complete
  if (booking.patronId !== req.user.userId && booking.servicePartnerId !== req.user.userId) {
    throw new ApiError(403, 'FORBIDDEN', 'Access denied to complete this booking');
  }

  if (booking.status !== 'accepted') {
    throw new ApiError(400, 'INVALID_STATUS', 'Only accepted bookings in progress can be completed');
  }

  await booking.update({
    status: 'completed',
    endDate: new Date()
  });

  // Set job to completed
  await Job.update({ status: 'completed' }, { where: { jobId: booking.jobId } });

  res.json({ success: true, message: 'Booking completed successfully', data: booking });
});

// Cancel booking
exports.cancelBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const { cancellationReason } = req.body;

  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
  }

  // Only patron or service partner can cancel
  if (booking.patronId !== req.user.userId && booking.servicePartnerId !== req.user.userId) {
    throw new ApiError(403, 'FORBIDDEN', 'Access denied to cancel this booking');
  }

  if (['completed', 'cancelled', 'rejected'].includes(booking.status)) {
    throw new ApiError(400, 'INVALID_STATUS', `Cannot cancel a booking that is ${booking.status}`);
  }

  await booking.update({
    status: 'cancelled',
    cancellationReason
  });

  // If the booking was accepted and in progress, revert the job status back to approved
  if (booking.status === 'accepted') {
    await Job.update({ status: 'approved' }, { where: { jobId: booking.jobId } });
  }

  res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
});
