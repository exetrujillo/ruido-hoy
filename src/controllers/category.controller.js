const { Category } = require('../models');

const categoryController = {
    getAll: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.json(categories);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener las categorías' });
        }
    },

    create: async (req, res) => {
        try {
            const { name } = req.body;
            const category = await Category.create({ name });
            res.status(201).json(category);
        } catch (err) {
            res.status(500).json({ error: 'Error al crear la categoría' });
        }
    }
};

module.exports = categoryController;
