const express = require('express');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/database');
const { User, Category, News, Comment, DailyStat } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let isSynced = false;
app.use(async (req, res, next) => {
    if (!isSynced && process.env.NODE_ENV !== 'test') {
        try {
            await sequelize.sync({ alter: true });
            console.log('Database Synced (Lazy)');
            isSynced = true;
        } catch (err) {
            console.error('Error syncing database on request:', err);
        }
    }
    next();
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/news', require('./routes/news.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/comments', require('./routes/comment.routes'));

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server local running on port ${PORT}`);
    });
}

module.exports = app;
