// src/routes/job.routes.js
const express = require('express');
const jobController = require('../controllers/job.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const jobValidator = require('../validators/job.validator');

const router = express.Router();

// Public routes for job list and detail
router.get('/', validate(jobValidator.listJobs), jobController.getJobs);
router.get('/:jobId', jobController.getJobById);

// Protected routes (require login)
router.post(
  '/',
  authenticate,
  validate(jobValidator.createJob),
  jobController.createJob
);

router.put(
  '/:jobId',
  authenticate,
  validate(jobValidator.updateJob),
  jobController.updateJob
);

router.delete(
  '/:jobId',
  authenticate,
  jobController.deleteJob
);

// Steward (Admin) only routes for moderation
router.post(
  '/:jobId/approve',
  authenticate,
  authenticate.authorize('steward'),
  jobController.approveJob
);

router.post(
  '/:jobId/reject',
  authenticate,
  authenticate.authorize('steward'),
  jobController.rejectJob
);

module.exports = router;
