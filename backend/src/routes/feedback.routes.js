const express = require('express');
const feedbackController = require('../controllers/feedback.controller');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.post('/', feedbackController.submitFeedback);

module.exports = router;
