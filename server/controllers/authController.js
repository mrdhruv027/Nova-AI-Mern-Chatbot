const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { getIsInMemory } = require('../config/db');
const mockStore = require('../utils/mockStore');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    if (getIsInMemory()) {
      const existingUser = mockStore.users.find((u) => u.email === cleanEmail);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const newUser = {
        _id: `user_${Date.now()}`,
        name,
        email: cleanEmail,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'AI Enthusiast & Explorer',
        themePreference: 'dark',
        createdAt: new Date(),
      };
      mockStore.users.push(newUser);

      const token = generateToken(newUser._id);
      return res.status(201).json({
        success: true,
        token,
        user: newUser,
        message: 'Registration successful',
      });
    }

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      avatar: avatar || undefined,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        themePreference: user.themePreference,
        createdAt: user.createdAt,
      },
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Registration Failed' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    if (getIsInMemory()) {
      let user = mockStore.users.find((u) => u.email === cleanEmail);
      
      if (!user) {
        const nameFromEmail = cleanEmail.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        user = {
          _id: `user_${Date.now()}`,
          name: formattedName,
          email: cleanEmail,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formattedName)}`,
          bio: 'AI Enthusiast & Explorer',
          themePreference: 'dark',
          createdAt: new Date(),
        };
        mockStore.users.push(user);
      }

      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user,
        message: 'Logged in successfully',
      });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        themePreference: user.themePreference,
        createdAt: user.createdAt,
      },
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Login Failed' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, bio, themePreference, avatar } = req.body;

    if (getIsInMemory()) {
      const user = mockStore.users.find((u) => u._id === req.user._id);
      if (user) {
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (themePreference) user.themePreference = themePreference;
        if (avatar) user.avatar = avatar;
      }
      return res.json({
        success: true,
        user: user || req.user,
        message: 'Profile updated successfully',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (themePreference) user.themePreference = themePreference;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    return res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        themePreference: updatedUser.themePreference,
        createdAt: updatedUser.createdAt,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
