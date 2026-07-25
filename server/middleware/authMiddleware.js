const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const { getIsInMemory } = require('../config/db');
const mockStore = require('../utils/mockStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);

      if (getIsInMemory()) {
        const user = mockStore.users.find((u) => u._id === decoded.id || u._id === 'mock_user_1');
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found in demo memory store' });
        }
        req.user = user;
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        // Fallback to mock user if DB record not found
        req.user = mockStore.users[0];
      }
      return next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
