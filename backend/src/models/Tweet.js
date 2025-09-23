const db = require('../config/db');

const Tweet = {
  // Cria um novo tweet
  async create({ user_id, content }) {
    const result = await db('tweets')
      .insert({ user_id, content })
      .returning('*');
    return result[0];
  },

  // Busca tweet por id
  async findById(id) {
    const result = await db('tweets').where({ id }).first();
    return result;
  },

  // Lista todos os tweets (feed geral)
  async findAll() {
    const result = await db('tweets')
      .select('tweets.*', 'users.username', 'users.email')
      .select(db.raw('COUNT(likes.id) as likes_count'))
      .join('users', 'tweets.user_id', 'users.id')
      .leftJoin('likes', 'tweets.id', 'likes.tweet_id')
      .groupBy('tweets.id', 'users.id', 'users.username', 'users.email')
      .orderBy('tweets.created_at', 'desc');
    return result;
  },

  // Lista tweets de um usuário específico
  async findByUserId(user_id) {
    const result = await db('tweets')
      .select('tweets.*', 'users.username', 'users.email')
      .select(db.raw('COUNT(likes.id) as likes_count'))
      .join('users', 'tweets.user_id', 'users.id')
      .leftJoin('likes', 'tweets.id', 'likes.tweet_id')
      .where('tweets.user_id', user_id)
      .groupBy('tweets.id', 'users.id', 'users.username', 'users.email')
      .orderBy('tweets.created_at', 'desc');
    return result;
  }
};

module.exports = Tweet;