const express = require('express');
const router = express.Router();
const {
  getChats,
  createChat,
  getChatById,
  updateChatTitle,
  togglePinChat,
  toggleFavoriteChat,
  deleteChat,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getChats).post(createChat);
router.route('/:id').get(getChatById).put(updateChatTitle).delete(deleteChat);
router.patch('/:id/pin', togglePinChat);
router.patch('/:id/favorite', toggleFavoriteChat);

module.exports = router;
