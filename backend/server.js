const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authRoutes = require('./src/routes/authRoutes');
const tweetsRoutes = require('./src/routes/tweetsLikesRoutes');
const userRoutes = require('./src/routes/userRoutes');

// Middlewares
app.use(cors()); // Allow requests from any origin
app.use(express.json()); // allows receiving JSON in the body
app.use(express.urlencoded({ extended: true }));

// Serve static files (avatar images)
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (res) => {
  res.json({ message: 'Twitter Clone API funcionando!' });
});

// Define routes
app.use('/auth', authRoutes);
app.use('/tweets', tweetsRoutes);
app.use('/users', userRoutes);

// Error handling middleware
app.use((err, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));