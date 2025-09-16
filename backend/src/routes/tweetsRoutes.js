const express = require('express');
const router = express.Router();
const { createTweet, getFeed } = require('../controllers/tweetsController');
const auth = require('../middlewares/auth');

// Token-protected route
router.post('/', auth, createTweet);
router.get('/', auth, getFeed);

module.exports = router;