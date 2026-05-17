// src/controllers/job.controller.js
const { Job, Category, User } = require('../models');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// Public route: Get filtered jobs with pagination
exports.getJobs = catchAsync(async (req, res) => {
  const { categoryId, status, locationType, priority, search, budgetMin, budgetMax, page, limit } = req.query;

  const whereClause = {};

  // Filters
  if (categoryId) whereClause.categoryId = categoryId;
  if (status) {
    whereClause.status = status;
  } else {
    // Default to approved jobs for public listing, unless specified
    whereClause.status = 'approved';
  }
  if (locationType) whereClause.locationType = locationType;
  if (priority) whereClause.priority = priority;

  // Budget range filter
  if (budgetMin !== undefined || budgetMax !== undefined) {
    whereClause.budgetMax = {};
    if (budgetMin !== undefined) {
      whereClause.budgetMax[Op.gte] = parseFloat(budgetMin);
    }
    if (budgetMax !== undefined) {
      whereClause.budgetMax[Op.lte] = parseFloat(budgetMax);
    }
  }

  // Full-text search on title or description
  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Job.findAndCountAll({
    where: whereClause,
    include: [
      { model: Category, as: 'category', attributes: ['categoryId', 'name', 'iconUrl'] },
      { model: User, as: 'patron', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] }
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    data: {
      jobs: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
});

// Public route: Get single job by ID (increments viewed count)
exports.getJobById = catchAsync(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findByPk(jobId, {
    include: [
      { model: Category, as: 'category', attributes: ['categoryId', 'name', 'iconUrl'] },
      { model: User, as: 'patron', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] }
    ]
  });

  if (!job) {
    throw new ApiError(404, 'JOB_NOT_FOUND', 'Job post not found');
  }

  // Increment viewed count asynchronously
  await job.increment('viewedCount');

  res.json({ success: true, data: job });
});

// Patron only: Create a new job post
exports.createJob = catchAsync(async (req, res) => {
  // Ensure user is patron or steward
  if (req.user.role === 'service_partner') {
    throw new ApiError(403, 'FORBIDDEN_ROLE', 'Only Patrons can create job posts');
  }

  // Validate category
  const category = await Category.findByPk(req.body.categoryId);
  if (!category || !category.isActive) {
    throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Valid category not found');
  }

  const job = await Job.create({
    ...req.body,
    patronId: req.user.userId,
    status: 'pending' // requires steward approval by default
  });

  res.status(201).json({ success: true, data: job });
});

// Patron Owner / Steward: Update job post
exports.updateJob = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new ApiError(404, 'JOB_NOT_FOUND', 'Job post not found');
  }

  // Check ownership
  if (job.patronId !== req.user.userId && req.user.role !== 'steward') {
    throw new ApiError(403, 'FORBIDDEN', 'You do not own this job post');
  }

  if (req.body.categoryId) {
    const category = await Category.findByPk(req.body.categoryId);
    if (!category || !category.isActive) {
      throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Valid category not found');
    }
  }

  await job.update(req.body);
  res.json({ success: true, data: job });
});

// Patron Owner / Steward: Cancel/Delete job post
exports.deleteJob = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new ApiError(404, 'JOB_NOT_FOUND', 'Job post not found');
  }

  // Check ownership
  if (job.patronId !== req.user.userId && req.user.role !== 'steward') {
    throw new ApiError(403, 'FORBIDDEN', 'You do not own this job post');
  }

  // Cancel the job status instead of hard deleting (keeps database audit trail)
  await job.update({ status: 'cancelled' });

  res.json({ success: true, message: 'Job post cancelled successfully' });
});

// Steward only: Approve job
exports.approveJob = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new ApiError(404, 'JOB_NOT_FOUND', 'Job post not found');
  }

  await job.update({ status: 'approved', rejectionReason: null });
  res.json({ success: true, message: 'Job approved successfully', data: job });
});

// Steward only: Reject job
exports.rejectJob = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const { reason } = req.body;

  if (!reason) {
    throw new ApiError(400, 'REASON_REQUIRED', 'Please provide a rejection reason');
  }

  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new ApiError(404, 'JOB_NOT_FOUND', 'Job post not found');
  }

  await job.update({ status: 'rejected', rejectionReason: reason });
  res.json({ success: true, message: 'Job rejected successfully', data: job });
});
