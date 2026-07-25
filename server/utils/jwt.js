const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_nova_ai_2026';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_nova_ai_2026';
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
