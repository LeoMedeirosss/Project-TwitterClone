const pool = require('../config/db');

const Like = {
  // Adiciona um like a um tweet
  async create({ user_id, tweet_id }) {
    const result = await pool.query(
      'INSERT INTO likes (user_id, tweet_id) VALUES ($1, $2) RETURNING *',
      [user_id, tweet_id]
    );
    return result.rows[0];
  },

  // Remove um like de um tweet
  async remove({ user_id, tweet_id }) {
    const result = await pool.query(
      'DELETE FROM likes WHERE user_id = $1 AND tweet_id = $2 RETURNING *',
      [user_id, tweet_id]
    );
    return result.rows[0];
  },

  // Conta likes de um tweet
  async countByTweetId(tweet_id) {
    const result = await pool.query(
      'SELECT COUNT(*) FROM likes WHERE tweet_id = $1',
      [tweet_id]
    );
    return parseInt(result.rows[0].count, 10);
  },

  // Verifica se um usuário já curtiu um tweet
  async isLiked({ user_id, tweet_id }) {
    const result = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND tweet_id = $2',
      [user_id, tweet_id]
    );
    return result.rows.length > 0;
  }
};

module.exports = Like;