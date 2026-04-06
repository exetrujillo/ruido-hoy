const { News, Category, User, Comment } = require('../models');

const newsController = {
    getAll: async (req, res) => {
        try {
            const { categoryId, search } = req.query;
            const where = categoryId ? { categoryId } : {};

            if (search) {
                const { Op } = require('sequelize');
                where.title = { [Op.iLike]: `%${search}%` };
            }

            const news = await News.findAll({
                where,
                order: [['createdAt', 'DESC']],
                include: [
                    { model: Category, as: 'category' },
                    { model: User, as: 'author', attributes: ['id', 'name'] }
                ]
            });
            res.json(news);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener las noticias' });
        }
    },

    getById: async (req, res) => {
        try {
            const news = await News.findByPk(req.params.id, {
                include: [
                    { model: Category, as: 'category' },
                    { model: User, as: 'author', attributes: ['id', 'name'] },
                    {
                        model: Comment, as: 'comments', include: [
                            { model: User, as: 'user', attributes: ['name'] }
                        ]
                    }
                ],
                order: [[{ model: Comment, as: 'comments' }, 'createdAt', 'DESC']]
            });
            if (!news) return res.status(404).json({ error: 'Noticia no encontrada' });
            res.json(news);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener la noticia' });
        }
    },

    create: async (req, res) => {
        try {
            const { title, content, imageUrl, categoryId } = req.body;
            const news = await News.create({
                title,
                content,
                imageUrl,
                categoryId,
                authorId: req.user.id
            });
            res.status(201).json(news);
        } catch (err) {
            res.status(500).json({ error: 'Error al crear la noticia' });
        }
    }
};

module.exports = newsController;
