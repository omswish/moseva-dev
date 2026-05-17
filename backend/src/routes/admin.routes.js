const express = require('express');
const adminController = require('../controllers/admin.controller');
const authenticate = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + admin or superadmin role
router.use(authenticate, authenticate.authorize('admin', 'superadmin'));

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/users/:userId/toggle-active', adminController.toggleUserActive);

// Job management
router.get('/jobs', adminController.getAllJobs);
router.put('/jobs/:jobId/status', adminController.adminUpdateJobStatus);

// Customer complaints / feedback
router.get('/feedback', adminController.getComplaints);
router.put('/feedback/:feedbackId', adminController.updateComplaintStatus);

// DPDP data removal requests (grievances)
router.get('/dpdp', adminController.getRemovalRequests);
router.put('/dpdp/:requestId', adminController.updateRemovalRequest);

module.exports = router;
