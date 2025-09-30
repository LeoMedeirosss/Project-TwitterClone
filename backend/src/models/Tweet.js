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

  // Lista todos os tweets (feed geral) com paginação
  async findAll(limit = 10, offset = 0) {
    // Validação dos parâmetros de paginação
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

  // Lista todos os tweets com informação se o usuário atual curtiu, com paginação
  async findAllWithUserLikes(currentUserId, limit = 10, offset = 0) {
    // Validação dos parâmetros de paginação
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

  // Lista tweets de um usuário específico
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

  // Exclui um tweet (apenas o dono pode excluir)
  async delete(id, user_id) {
    const result = await db('tweets')
      .where({ id, user_id }) // Garante que só o dono pode excluir
      .del()
      .returning('*');
    return result[0];
  }
};

module.exports = Tweet;