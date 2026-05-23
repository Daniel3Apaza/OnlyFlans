const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { register, login, me, logout } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);

router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);

module.exports = router;
