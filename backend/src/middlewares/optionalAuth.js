// Middleware de autenticação opcional - não bloqueia se não houver token
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Se não há header de autorização, continua sem usuário
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Saves user information in the request
  } catch (err) {
    // If the token is invalid, it remains without a user (does not block)
    req.user = null;
  }
  
  next();
};