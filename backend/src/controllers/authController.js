const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET; // Key to sign tokens
const EXPIRES_IN = process.env.JWT_EXPIRES || '1h';

// Register user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe com este email' });
    }

    // Encrypts password before saving
    const password_hash = await bcrypt.hash(password, 10); // Creates secure hash

    // Create user using model
    const user = await User.create({ username, email, password_hash });

    // Create JWT token with user id
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: EXPIRES_IN });

    res.json({ user, token });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(400).json({ error: err.message });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Search user by email using model
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    // Compares entered password with stored hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: EXPIRES_IN });

    res.json({ user, token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: err.message });
  }
};