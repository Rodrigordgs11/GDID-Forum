const express = require('express');
const {authenticate} = require('../middlewares/authenticate');

const router = express.Router();

router.get('/protected', authenticate, (req, res) => {
    return res.json({ message: 'Protected route fetched successfully' });
});

module.exports = router;