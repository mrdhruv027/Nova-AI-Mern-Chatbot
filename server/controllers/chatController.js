const Chat = require('../models/Chat');
const Message = require('../models/Message');
const { getIsInMemory } = require('../config/db');
const mockStore = require('../utils/mockStore');

// @desc    Get all user chats
// @route   GET /api/chats
// @access  Private
const getChats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { search } = req.query;

    if (getIsInMemory()) {
      let chats = mockStore.chats.filter((c) => String(c.userId) === String(userId));
      if (search) {
        const q = search.toLowerCase();
        chats = chats.filter((c) => c.title.toLowerCase().includes(q));
      }
      chats.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.updatedAt) - new Date(a.updatedAt));
      return res.json({ success: true, chats });
    }

    let filter = { userId };
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const chats = await Chat.find(filter).sort({ isPinned: -1, updatedAt: -1 });

    return res.json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new chat
// @route   POST /api/chats
// @access  Private
const createChat = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, modelUsed } = req.body;

    if (getIsInMemory()) {
      const newChat = {
        _id: `chat_${Date.now()}`,
        userId: String(userId),
        title: title || 'New Conversation',
        isPinned: false,
        isFavorite: false,
        modelUsed: modelUsed || 'gemini-1.5-flash',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockStore.chats.unshift(newChat);
      return res.status(201).json({ success: true, chat: newChat });
    }

    const chat = await Chat.create({
      userId,
      title: title || 'New Conversation',
      modelUsed: modelUsed || 'gemini-1.5-flash',
    });

    return res.status(201).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat by ID with messages
// @route   GET /api/chats/:id
// @access  Private
const getChatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (getIsInMemory()) {
      const chat = mockStore.chats.find((c) => String(c._id) === String(id));
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Chat not found' });
      }
      const messages = mockStore.messages
        .filter((m) => String(m.chatId) === String(id))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      return res.json({ success: true, chat, messages });
    }

    const chat = await Chat.findOne({ _id: id, userId });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const messages = await Message.find({ chatId: id }).sort({ createdAt: 1 });

    return res.json({ success: true, chat, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chat title
// @route   PUT /api/chats/:id
// @access  Private
const updateChatTitle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (getIsInMemory()) {
      const chat = mockStore.chats.find((c) => String(c._id) === String(id));
      if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
      chat.title = title.trim();
      chat.updatedAt = new Date();
      return res.json({ success: true, chat });
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title: title.trim() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    return res.json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle chat pin status
// @route   PATCH /api/chats/:id/pin
// @access  Private
const togglePinChat = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsInMemory()) {
      const chat = mockStore.chats.find((c) => String(c._id) === String(id));
      if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
      chat.isPinned = !chat.isPinned;
      return res.json({ success: true, chat });
    }

    const chat = await Chat.findOne({ _id: id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    chat.isPinned = !chat.isPinned;
    await chat.save();

    return res.json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle chat favorite status
// @route   PATCH /api/chats/:id/favorite
// @access  Private
const toggleFavoriteChat = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsInMemory()) {
      const chat = mockStore.chats.find((c) => String(c._id) === String(id));
      if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
      chat.isFavorite = !chat.isFavorite;
      return res.json({ success: true, chat });
    }

    const chat = await Chat.findOne({ _id: id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    chat.isFavorite = !chat.isFavorite;
    await chat.save();

    return res.json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chat and messages
// @route   DELETE /api/chats/:id
// @access  Private
const deleteChat = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsInMemory()) {
      mockStore.chats = mockStore.chats.filter((c) => String(c._id) !== String(id));
      mockStore.messages = mockStore.messages.filter((m) => String(m.chatId) !== String(id));
      return res.json({ success: true, message: 'Chat deleted' });
    }

    const chat = await Chat.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    await Message.deleteMany({ chatId: id });

    return res.json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChats,
  createChat,
  getChatById,
  updateChatTitle,
  togglePinChat,
  toggleFavoriteChat,
  deleteChat,
};
