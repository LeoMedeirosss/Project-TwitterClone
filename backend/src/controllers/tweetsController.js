const db = require('../config/db');

// Create new tweet
exports.createTweet = async (req, res) => {
  const { content } = req.body; 
  const user_id = req.user.id; // Comes from the auth middleware

  try {
    const inserted = await db('tweets')
      .insert({ user_id, content })
      .returning('*');
      
    res.json(inserted[0]); // Returns created tweet
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search general tweet feed
exports.getFeed = async (req, res) => {
  try {
    const tweets = await db('tweets')

       // Join users table to display username in feed
      .join('users', 'tweets.user_id', 'users.id')
      .select('tweets.*', 'users.username')
      .orderBy('tweets.created_at', 'desc'); // Newest first

    res.json(tweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tweets from a specific user
exports.getTweetsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const tweets = await db('tweets')
      .where('tweets.user_id', userId)
      .join('users', 'tweets.user_id', 'users.id')
      .select('tweets.*', 'users.username')
      .orderBy('tweets.created_at', 'desc');

    res.json(tweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};