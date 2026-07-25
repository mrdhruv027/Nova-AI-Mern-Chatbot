const express = require('express');
const router = express.Router();
const { streamChatResponse } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, streamChatResponse);

module.exports = router;
