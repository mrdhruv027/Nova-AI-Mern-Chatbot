const express = require('express');
const router = express.Router();
const { getImageKitAuth, uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.get('/imagekit-auth', protect, getImageKitAuth);
router.post('/image', protect, uploadImage);

module.exports = router;
