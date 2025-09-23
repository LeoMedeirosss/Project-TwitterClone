const pool = require('../config/db');

const Tweet = {
  // Cria um novo tweet
  async create({ user_id, content }) {
    const result = await pool.query(
      'INSERT INTO tweets (user_id, content) VALUES ($1, $2) RETURNING *',
      [user_id, content]
    );
    return result.rows[0];
  },

  // Busca tweet por id
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM tweets WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Lista todos os tweets (feed geral)
  async findAll() {
    const result = await pool.query(
      `SELECT tweets.*, users.username 
       FROM tweets 
       JOIN users ON tweets.user_id = users.id 
       ORDER BY tweets.created_at DESC`
    );
    return result.rows;
  },

  // Lista tweets de um usuário específico
  async findByUserId(user_id) {
    const result = await pool.query(
      `SELECT tweets.*, users.username 
       FROM tweets 
       JOIN users ON tweets.user_id = users.id 
       WHERE tweets.user_id = $1 
       ORDER BY tweets.created_at DESC`,
      [user_id]
    );
    return result.rows;
  }
};

module.exports = Tweet;