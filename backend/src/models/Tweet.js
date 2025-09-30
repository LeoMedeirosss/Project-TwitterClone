const db = require('../config/db');

const Tweet = {
  // Create a new tweet
  async create({ user_id, content }) {
    const result = await db('tweets')
      .insert({ user_id, content })
      .returning('*');
    return result[0];
  },

  // Find a tweet by id
  async findById(id) {
    const result = await db('tweets').where({ id }).first();
    return result;
  },

  // List all tweets (general feed) with pagination
  async findAll(limit = 10, offset = 0) {
    // Validation of pagination parameters
    limit = parseInt(limit) || 10;
    offset = parseInt(offset) || 0;
    
    const result = await db('tweets')
      .select('tweets.*', 'users.username', 'users.email', 'users.avatar_url')
      .select(db.raw('COUNT(likes.id) as likes_count'))
      .join('users', 'tweets.user_id', 'users.id')
      .leftJoin('likes', 'tweets.id', 'likes.tweet_id')
      .groupBy('tweets.id', 'users.id', 'users.username', 'users.email', 'users.avatar_url')
      .orderBy('tweets.created_at', 'desc')
      .limit(limit)
      .offset(offset);
    return result;
  },

  // List all tweets with user like information (general feed) with pagination
  async findAllWithUserLikes(currentUserId, limit = 10, offset = 0) {
    // Validation of pagination parameters
    limit = parseInt(limit) || 10;
    offset = parseInt(offset) || 0;
    
    const result = await db('tweets')
      .select('tweets.*', 'users.username', 'users.email', 'users.avatar_url')
      .select(db.raw('COUNT(likes.id) as likes_count'))
      .select(db.raw(`
        CASE WHEN user_likes.user_id IS NOT NULL THEN true ELSE false END as liked
      `))
      .join('users', 'tweets.user_id', 'users.id')
      .leftJoin('likes', 'tweets.id', 'likes.tweet_id')
      .leftJoin('likes as user_likes', function() {
        this.on('tweets.id', '=', 'user_likes.tweet_id')
            .andOn('user_likes.user_id', '=', db.raw('?', [currentUserId]));
      })
      .groupBy('tweets.id', 'users.id', 'users.username', 'users.email', 'users.avatar_url', 'user_likes.user_id')
      .orderBy('tweets.created_at', 'desc')
      .limit(limit)
      .offset(offset);
    return result;
  },

  // List tweets from a specific user
  async findByUserId(user_id) {
    const result = await db('tweets')
      .select('tweets.*', 'users.username', 'users.email', 'users.avatar_url')
      .select(db.raw('COUNT(likes.id) as likes_count'))
      .join('users', 'tweets.user_id', 'users.id')
      .leftJoin('likes', 'tweets.id', 'likes.tweet_id')
      .where('tweets.user_id', user_id)
      .groupBy('tweets.id', 'users.id', 'users.username', 'users.email', 'users.avatar_url')
      .orderBy('tweets.created_at', 'desc');
    return result;
  },

  // Delete a tweet (only the owner can delete)
  async delete(id, user_id) {
    const result = await db('tweets')
      .where({ id, user_id }) // Ensures only the owner can delete
      .del()
      .returning('*');
    return result[0];
  }
};

module.exports = Tweet;