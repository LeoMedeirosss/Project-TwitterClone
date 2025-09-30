const db = require('../config/db');

const Like = {
  // Add a like to a tweet
  async create({ user_id, tweet_id }) {
    const result = await db('likes')
      .insert({ user_id, tweet_id })
      .returning('*');
    return result[0];
  },

  // Remove a like from a tweet
  async remove({ user_id, tweet_id }) {
    const result = await db('likes')
      .where({ user_id, tweet_id })
      .del()
      .returning('*');
    return result[0];
  },

  // Count likes for a tweet
  async countByTweetId(tweet_id) {
    const result = await db('likes')
      .where({ tweet_id })
      .count('* as count')
      .first();
    return parseInt(result.count, 10);
  },

  // Check if a user has liked a tweet
  async isLiked({ user_id, tweet_id }) {
    const result = await db('likes')
      .where({ user_id, tweet_id })
      .first();
    return !!result;
  }
};

module.exports = Like;