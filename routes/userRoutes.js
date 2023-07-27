const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.create(req.body);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: `Failed to create user. ${error} ${req.body}` });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: `Failed to fetch users. ${error}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await User.update(req.body, {
      where: { id: req.params.id }
    });
    return res.json({ message: 'User updated successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user.' });
  }
});

router.delete('/:id', async (req, res) => {
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
