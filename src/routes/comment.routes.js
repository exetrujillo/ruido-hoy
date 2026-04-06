const express = require('express');
const router = express.Router();
const { Comment } = require('../models');
const { authenticateToken } = require('../middleware/auth');
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { content, newsId } = req.body;
        const comment = await Comment.create({
            content,
            newsId,
            userId: req.user.id
        });
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Error al publicar el comentario' });
    }
});

module.exports = router;
