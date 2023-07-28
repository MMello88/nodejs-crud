const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.generateToken = async (id) => {
  const token = jwt.sign({ id }, '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f', { expiresIn: '1h' });
  return token;
};

exports.authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f');
    req.user = await User.findByPk(decodedToken.id);
    next();
  } catch {
    res.status(401).json({ message: 'Auth failed!' });
  }
};
