const pool = require('../config/db');

const User = {
  // Cria um novo usuário
  async create({ username, email, password_hash }) {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password_hash]
    );
    return result.rows[0];
  },

  // Busca usuário por email
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Busca usuário por id
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Lista todos os usuários
  async findAll() {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  }
};

module.exports = User;