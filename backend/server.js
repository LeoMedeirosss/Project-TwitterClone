const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authRoutes = require('./src/routes/authRoutes');
const tweetsRoutes = require('./src/routes/tweetsLikesRoutes');

// Middlewares
app.use(cors()); // Permite requisições de qualquer origem
app.use(express.json()); // allows receiving JSON in the body
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Twitter Clone API funcionando!' });
});

// Define routes
app.use('/auth', authRoutes);
app.use('/tweets', tweetsRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));