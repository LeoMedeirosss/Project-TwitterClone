const express = require('express');
const auth = require('../middlewares/auth');
const optionalAuth = require('../middlewares/optionalAuth');
const tweetController = require('../controllers/tweetsController');
const likeController = require('../controllers/likeController');
const { validateTweet } = require('../middlewares/validateTweet');

const router = express.Router();

// Tweets
router.post('/', auth, validateTweet, tweetController.createTweet);
router.get('/', optionalAuth, tweetController.getFeed);
router.get('/:userId', tweetController.getTweetsByUser);
router.delete('/:id', auth, tweetController.deleteTweet);

// Likes
router.post('/:id/like', auth, likeController.likeTweet);
router.delete('/:id/like', auth, likeController.unlikeTweet);

module.exports = router;