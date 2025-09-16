const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const tweetsRoutes = require('./routes/tweetsRoutes');

app.use(express.json()); // allows receiving JSON in the body

// Define routes
app.use('/auth', authRoutes); // prefix all auth routes with /auth
app.use('/tweets', tweetsRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));