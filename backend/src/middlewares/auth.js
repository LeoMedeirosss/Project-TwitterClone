// Checks if the token exists and is valid
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization; // WAIT "Bearer <token>"
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  if (!authHeader.startsWith('Bearer ')) { //verifica prefixo bearer
    return res.status(401).json({ error: 'Formato de token inválido' });
  } 
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET); // Validates token
    req.user = decoded; // Saves user information in the request
    next();
  } catch (err) {
    console.error(err); //debug
    res.status(401).json({ error: 'Token inválido' });
  }
};