const express = require('express');
const {authenticate} = require('../middlewares/authenticate');
const checkRole = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/protected', authenticate, (req, res) => {
    return res.json({ message: 'Protected route fetched successfully' });
});

router.get('/protected-admin', authenticate, checkRole("admin"), (req, res) => {
    return res.json({ message: 'Protected admin route fetched successfully' });
});

module.exports = router;