const express = require('express');
const app = express();
const authRoutes = require('./src/routes/authRoutes');
const tweetsRoutes = require('./src/routes/tweetsLikesRoutes');

app.use(express.json()); // allows receiving JSON in the body

// Define routes
app.use('/auth', authRoutes);
app.use('/tweets', tweetsRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));