// src/routes/chat.routes.js
const express = require('express');
const chatController = require('../controllers/chat.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const chatValidator = require('../validators/chat.validator');

const router = express.Router();

// All chat routes require authentication
router.use(authenticate);

router.get('/conversations', chatController.getConversations);
router.post('/conversations', validate(chatValidator.createConversation), chatController.createConversation);
router.get('/conversations/:conversationId/messages', chatController.getMessages);

module.exports = router;
