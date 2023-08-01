const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../services/authService');


const { signUp, signIn, getMe, getAllUsers, getUser, createUser, updateUser, deleteUser, refreshToken } = require('../services/userService');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/refresh-token', refreshToken);


router.get('/me', authenticateToken, getMe);
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUser);
router.post('/', authenticateToken, createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);


module.exports = router;
