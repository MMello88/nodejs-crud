const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
var { expressjwt: ejwt } = require("express-jwt");
const jwt = require('jsonwebtoken');


// Função para extrair o token dos cookies
const getTokenFromCookies = (req) => {
  if (req && req.cookies) {
    return req.cookies['token'];
  }
  return null;
};

// Middleware para autenticar o token JWT
const authenticateJWT = ejwt({secret: '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f', algorithms: ['HS256'], getToken: getTokenFromCookies});

router.get('/users/me', authenticateJWT, async (req, res) => {
  try {
    // O token JWT foi autenticado com sucesso, agora podemos usá-lo para buscar o usuário
    const token = req.cookies['token'];
    const decodedToken = jwt.verify(token, '79a359ab1798240389b3fe71c676bf0fa33f9f9eef54116aab082184e8e73e8f');
    const user = await User.findOne({ where: { id: decodedToken.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/users', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    return res.status(201).json({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  } catch (error) {
    return res.status(500).json({ error: `Failed to create user. ${error} ${req.body}` });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: `Failed to fetch users. ${error}` });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const users = await User.findOne({ where: { id: req.params.id } });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: `Failed to fetch users. ${error}` });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    await User.update(req.body, {
      where: { id: req.params.id }
    });
    return res.json({ message: 'User updated successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user.' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id }
    });
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
