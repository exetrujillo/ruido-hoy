const express = require('express');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/database');
const { User, Category, News, Comment } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/news', require('./routes/news.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/comments', require('./routes/comment.routes'));

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced');
        if (!process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`Servidor local corriendo en el puerto ${PORT}`);
            });
        }
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

module.exports = app;


