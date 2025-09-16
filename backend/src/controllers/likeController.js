const db = require('../config/db');

// Like tweet
exports.likeTweet = async (req, res) => {
  const { id } = req.params; // ID tweet
  const user_id = req.user.id;

  try {
    // Check if you've liked it before
    const existing = await db('likes').where({ tweet_id: id, user_id }).first();
    if (existing) {
      return res.status(400).json({ error: 'Você já curtiu este tweet.' });
    }

    const inserted = await db('likes')
      .insert({ tweet_id: id, user_id })
      .returning('*');

    res.json(inserted[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove like
exports.unlikeTweet = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const deleted = await db('likes').where({ tweet_id: id, user_id }).del();
    if (!deleted) {
      return res.status(400).json({ error: 'Você não curtiu este tweet.' });
    }

    res.json({ message: 'Like removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};