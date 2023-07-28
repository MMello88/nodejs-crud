
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('./authService');

exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashedPassword });
  const token = await generateToken(user.id);
  res.json({ user, token });
};

exports.signIn = async (req, res) => {
  // Add sign in logic here
};

exports.getMe = async (req, res) => {
  // Add get me logic here
};

exports.getAllUsers = async (req, res) => {
  // Add get all users logic here
};

exports.getUser = async (req, res) => {
  // Add get user by id logic here
};

exports.createUser = async (req, res) => {
  // Add create user logic here
};

exports.updateUser = async (req, res) => {
  // Add update user logic here
};

exports.deleteUser = async (req, res) => {
  // Add delete user logic here
};
