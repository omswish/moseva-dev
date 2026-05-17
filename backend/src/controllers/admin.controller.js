const { Feedback, DataRemovalRequest, User, Job, Booking, Category } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// ─── DASHBOARD STATS ─────────────────────────────────────────
exports.getDashboardStats = catchAsync(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalJobs,
    pendingJobs,
    approvedJobs,
    totalBookings,
    completedBookings,
    activeBookings,
    totalComplaints,
    openComplaints,
    totalDpdpRequests,
    pendingDpdpRequests,
    usersByRole,
    recentUsers,
    recentJobs
  ] = await Promise.all([
    User.count(),
    User.count({ where: { isActive: true } }),
    Job.count(),
    Job.count({ where: { status: 'pending' } }),
    Job.count({ where: { status: 'approved' } }),
    Booking.count(),
    Booking.count({ where: { status: 'completed' } }),
    Booking.count({ where: { status: { [Op.in]: ['pending', 'accepted'] } } }),
    Feedback.count(),
    Feedback.count({ where: { status: 'open' } }),
    DataRemovalRequest.count(),
    DataRemovalRequest.count({ where: { status: 'pending' } }),
    User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('role')), 'count']
      ],
      group: ['role'],
      raw: true
    }),
    User.findAll({
      attributes: ['userId', 'username', 'email', 'role', 'isActive', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5
    }),
    Job.findAll({
      attributes: ['jobId', 'title', 'status', 'created_at'],
      include: [{ model: User, as: 'patron', attributes: ['username'] }],
      order: [['created_at', 'DESC']],
      limit: 5
    })
  ]);

  res.json({
    success: true,
    data: {
      users: { total: totalUsers, active: activeUsers, byRole: usersByRole },
      jobs: { total: totalJobs, pending: pendingJobs, approved: approvedJobs },
      bookings: { total: totalBookings, completed: completedBookings, active: activeBookings },
      complaints: { total: totalComplaints, open: openComplaints },
      dpdp: { total: totalDpdpRequests, pending: pendingDpdpRequests },
      recentUsers,
      recentJobs
    }
  });
});

// ─── USER MANAGEMENT ─────────────────────────────────────────
exports.getAllUsers = catchAsync(async (req, res) => {
  const { role, isActive, search, page = 1, limit = 20 } = req.query;
  const where = {};

  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (search) {
    where[Op.or] = [
      { username: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['passwordHash'] },
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset
  });

  res.json({
    success: true,
    data: {
      users: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    }
  });
});

exports.updateUserRole = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['patron', 'service_partner', 'steward', 'admin'].includes(role)) {
    throw new ApiError(400, 'INVALID_ROLE', 'Invalid role specified');
  }

  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');

  // Prevent modifying superadmin role
  if (user.role === 'superadmin') {
    throw new ApiError(403, 'FORBIDDEN', 'Cannot modify superadmin role');
  }

  await user.update({ role });
  res.json({ success: true, data: user });
});

exports.toggleUserActive = catchAsync(async (req, res) => {
  const { userId } = req.params;
  
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');

  // Prevent deactivating superadmin
  if (user.role === 'superadmin') {
    throw new ApiError(403, 'FORBIDDEN', 'Cannot deactivate superadmin');
  }

  await user.update({ isActive: !user.isActive });
  res.json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` });
});

// ─── JOB MANAGEMENT ─────────────────────────────────────────
exports.getAllJobs = catchAsync(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const where = {};

  if (status) where.status = status;
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { count, rows } = await Job.findAndCountAll({
    where,
    include: [
      { model: Category, as: 'category', attributes: ['categoryId', 'name'] },
      { model: User, as: 'patron', attributes: ['userId', 'username', 'email'] }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset
  });

  res.json({
    success: true,
    data: {
      jobs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    }
  });
});

exports.adminUpdateJobStatus = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const { status, rejectionReason } = req.body;

  const job = await Job.findByPk(jobId);
  if (!job) throw new ApiError(404, 'NOT_FOUND', 'Job not found');

  const updates = { status };
  if (status === 'rejected' && rejectionReason) {
    updates.rejectionReason = rejectionReason;
  }
  if (status === 'approved') {
    updates.rejectionReason = null;
  }

  await job.update(updates);
  res.json({ success: true, data: job });
});

// ─── COMPLAINTS / FEEDBACK ──────────────────────────────────
exports.getComplaints = catchAsync(async (req, res) => {
  const { status, type } = req.query;
  const where = {};
  if (status) where.status = status;
  if (type) where.type = type;

  const feedbacks = await Feedback.findAll({
    where,
    include: [{ model: User, as: 'user', attributes: ['userId', 'username', 'email'] }],
    order: [['created_at', 'DESC']]
  });
  res.json({ success: true, data: feedbacks });
});

exports.updateComplaintStatus = catchAsync(async (req, res) => {
  const { feedbackId } = req.params;
  const { status, adminNotes } = req.body;
  
  const feedback = await Feedback.findByPk(feedbackId);
  if (!feedback) throw new ApiError(404, 'NOT_FOUND', 'Feedback not found');
  
  if (status) feedback.status = status;
  if (adminNotes) feedback.adminNotes = adminNotes;
  
  await feedback.save();
  res.json({ success: true, data: feedback });
});

// ─── DPDP GRIEVANCES ────────────────────────────────────────
exports.getRemovalRequests = catchAsync(async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status) where.status = status;

  const requests = await DataRemovalRequest.findAll({
    where,
    include: [{ model: User, as: 'user', attributes: ['userId', 'username', 'email', 'isActive'] }],
    order: [['created_at', 'DESC']]
  });
  res.json({ success: true, data: requests });
});

exports.updateRemovalRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const { status, adminNotes } = req.body;
  
  const request = await DataRemovalRequest.findByPk(requestId, { include: ['user'] });
  if (!request) throw new ApiError(404, 'NOT_FOUND', 'Request not found');
  
  if (status) request.status = status;
  if (adminNotes) request.adminNotes = adminNotes;
  
  if (status === 'completed' && request.user) {
    // DPDP logic: Deactivate user and anonymize data
    request.user.isActive = false;
    await request.user.save();
    request.completedAt = new Date();
  }
  
  await request.save();
  res.json({ success: true, data: request });
});
