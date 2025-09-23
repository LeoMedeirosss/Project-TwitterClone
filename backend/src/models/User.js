const db = require('../config/db');

const User = {
  // Cria um novo usuário
  async create({ username, email, password_hash }) {
    const result = await db('users')
      .insert({ username, email, password_hash })
      .returning('*');
    return result[0];
  },

  // Busca usuário por email
  async findByEmail(email) {
    const result = await db('users').where({ email }).first();
    return result;
  },

  // Busca usuário por id
  async findById(id) {
    const result = await db('users').where({ id }).first();
    return result;
  },

  // Lista todos os usuários
  async findAll() {
    const result = await db('users').select('*');
    return result;
  },

  // Atualiza avatar do usuário
  async updateAvatar(id, avatarUrl) {
    const result = await db('users')
      .where({ id })
      .update({ avatar_url: avatarUrl })
      .returning('*');
    return result[0];
  }
};

module.exports = User;