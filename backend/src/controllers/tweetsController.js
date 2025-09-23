const Tweet = require('../models/Tweet');
const User = require('../models/User');

// Create new tweet
exports.createTweet = async (req, res) => {
  const { content } = req.body; 
  const user_id = req.user.id; // Comes from the auth middleware

  try {
    // Create tweet using model
    const tweet = await Tweet.create({ user_id, content });
    
    // Get user info to return with tweet
    const user = await User.findById(user_id);
    
    // Return tweet with user info
    const tweetWithUser = {
      ...tweet,
      likes_count: 0, // New tweets start with 0 likes
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
      
    res.json(tweetWithUser);
  } catch (err) {
    console.error("Erro ao criar tweet:", err);
    res.status(500).json({ error: err.message });
  }
};

// Search general tweet feed
exports.getFeed = async (req, res) => {
  try {
    // Get all tweets using model (already includes username and likes_count)
    const tweets = await Tweet.findAll();

    // Transform to include user object structure expected by frontend
    const tweetsWithUserObject = tweets.map(tweet => ({
      ...tweet,
      likes_count: parseInt(tweet.likes_count) || 0,
      user: {
        id: tweet.user_id,
        username: tweet.username,
        email: tweet.email
      }
    }));

    res.json(tweetsWithUserObject);
  } catch (err) {
    console.error("Erro ao buscar feed:", err);
    res.status(500).json({ error: err.message });
  }
};

// Tweets from a specific user
exports.getTweetsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get tweets by user using model
    const tweets = await Tweet.findByUserId(userId);

    // Transform to include user object structure expected by frontend
    const tweetsWithUserObject = tweets.map(tweet => ({
      ...tweet,
      likes_count: parseInt(tweet.likes_count) || 0,
      user: {
        id: tweet.user_id,
        username: tweet.username,
        email: tweet.email
      }
    }));

    res.json(tweetsWithUserObject);
  } catch (err) {
    console.error("Erro ao buscar tweets do usuário:", err);
    res.status(500).json({ error: err.message });
  }
};