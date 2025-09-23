const db = require('../config/db');

const Like = {
  // Adiciona um like a um tweet
  async create({ user_id, tweet_id }) {
    const result = await db('likes')
      .insert({ user_id, tweet_id })
      .returning('*');
    return result[0];
  },

  // Remove um like de um tweet
  async remove({ user_id, tweet_id }) {
    const result = await db('likes')
      .where({ user_id, tweet_id })
      .del()
      .returning('*');
    return result[0];
  },

  // Conta likes de um tweet
  async countByTweetId(tweet_id) {
    const result = await db('likes')
      .where({ tweet_id })
      .count('* as count')
      .first();
    return parseInt(result.count, 10);
  },

  // Verifica se um usuário já curtiu um tweet
  async isLiked({ user_id, tweet_id }) {
    const result = await db('likes')
      .where({ user_id, tweet_id })
      .first();
    return !!result;
  }
};

module.exports = Like;