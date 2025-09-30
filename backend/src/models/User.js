const db = require('../config/db');

const User = {
  // Create a new user
  async create({ username, email, password_hash }) {
    const result = await db('users')
      .insert({ username, email, password_hash })
      .returning('*');
    return result[0];
  },

  // Find a user by email
  async findByEmail(email) {
    const result = await db('users').where({ email }).first();
    return result;
  },

  // Find a user by id
  async findById(id) {
    const result = await db('users').where({ id }).first();
    return result;
  },

  // List all users
  async findAll() {
    const result = await db('users').select('*');
    return result;
  },

  // Update user avatar
  async updateAvatar(id, avatarUrl) {
    const result = await db('users')
      .where({ id })
      .update({ avatar_url: avatarUrl })
      .returning('*');
    return result[0];
  }
};

module.exports = User;