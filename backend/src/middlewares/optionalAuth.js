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
    req.user = decoded; // Salva informações do usuário na requisição
  } catch (err) {
    // Se o token é inválido, continua sem usuário (não bloqueia)
    req.user = null;
  }
  
  next();
};