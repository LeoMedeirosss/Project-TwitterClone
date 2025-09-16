const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET; // Key to sign tokens
const EXPIRES_IN = process.env.JWT_EXPIRES || '1h';

// Register user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Encrypts password before saving
    const password_hash = await bcrypt.hash(password, 10); // Creates secure hash

    const inserted = await db('users')
      .insert({ username, email, password_hash })
      .returning('*'); // Returns the record inserted in the database
    const user = inserted[0];

    // Create JWT token with user id
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: EXPIRES_IN });

    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Search user by email
    const users = await db('users').where({ email });
    if (!users.length) return res.status(400).json({ error: 'Usuário não encontrado' });

    const user = users[0];

    // Compares entered password with stored hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Senha inválida' });

    // Create JWT token
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: EXPIRES_IN });

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};