
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateToken, generateToken7d } = require('./authService');
const jwt = require('jsonwebtoken');

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ error: 'Refresh token é necessário!' });
  }

  const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });

  if (!storedToken || storedToken.revoked) {
    return res.status(403).json({ error: 'Refresh token inválido!' });
  }

  jwt.verify(refreshToken, '67e928cb32a47dd68902babaaf784656657b9038a34a06bdfe5010f5c2854f31', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Refresh token inválido!' });
    }

    const token = jwt.sign({ userId: user.userId }, '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f', { expiresIn: '1h' });

    // Marque o token antigo como revogado e armazene o novo token
    storedToken.revoked = true;
    storedToken.replacedByToken = token;
    storedToken.save();
    
    res.json({ token });
  });
};

exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashedPassword });
  const token = await generateToken(user.id);
  res.json({ user, token });
};

exports.signIn = async (req, res) => {
  // Add sign in logic here
  // Autentique o usuário
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: `Nome ou senha inválidos` });
  }

  // Crie o token JWT
  const token = await generateToken(user.id);
  const refreshToken = await generateToken7d(user.id); 

  // Armazene o refresh token no banco de dados
  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias a partir de agora
  });

  res.json({ token, refreshToken });
};

exports.getMe = async (req, res) => {
  // Add get me logic here
  try {
    // O token JWT foi autenticado com sucesso, agora podemos usá-lo para buscar o usuário
    /*const token = req.cookies['token'];
    const decodedToken = jwt.verify(token, '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f');
    const user = await User.findOne({ where: { id: decodedToken.id } });*/

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(req.user);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }

};

exports.getAllUsers = async (req, res) => {
  // Add get all users logic here
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: `Failed to fetch users. ${error}` });
  }
};

exports.getUser = async (req, res) => {
  // Add get user by id logic here
  try {
    const users = await User.findOne({ where: { id: req.params.id } });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: `Failed to fetch users. ${error}` });
  }
};

exports.createUser = async (req, res) => {
  // Add create user logic here
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    return res.status(201).json({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  } catch (error) {
    return res.status(500).json({ error: `Failed to create user. ${error} ${req.body}` });
  }
};

exports.updateUser = async (req, res) => {
  // Add update user logic here
  try {
    await User.update(req.body, {
      where: { id: req.params.id }
    });
    return res.json({ message: 'User updated successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user.' });
  }
};

exports.deleteUser = async (req, res) => {
  // Add delete user logic here
  try {
    await User.destroy({
      where: { id: req.params.id }
    });
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
};
