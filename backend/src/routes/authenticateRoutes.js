const express = require('express');
const {authenticate} = require('../middlewares/authenticate');
const checkRole = require('../middlewares/authMiddleware');
const { login, token_refresh, logout, getAuthMethod } = require('../services/authService');

const router = express.Router();

router.get('/protected', authenticate, (req, res) => {
    return res.json({ message: 'Protected route fetched successfully' });
});

router.get('/protected-admin', authenticate, checkRole("admin"), (req, res) => {
    return res.json({ message: 'Protected admin route fetched successfully' });
});

router.post('/login', login);
router.get('/refresh-token', token_refresh);
router.get('/logout', logout);
router.get('/auth-method', getAuthMethod);

module.exports = router;