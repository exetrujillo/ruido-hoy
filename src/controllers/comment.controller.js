const { Comment, DailyStat } = require('../models');

const commentController = {
    create: async (req, res) => {
        try {
            const { content, newsId } = req.body;

            // Máximo 100 comentarios diarios. No queremos que nos revienten la base.
            const todayStr = new Date().toISOString().split('T')[0];
            const [stat] = await DailyStat.findOrCreate({
                where: { type: 'comment_post' },
                defaults: { count: 0, lastUpdated: todayStr }
            });

            if (stat.lastUpdated !== todayStr) {
                stat.count = 1;
                stat.lastUpdated = todayStr;
                await stat.save();
            } else {
                if (stat.count >= 100) {
                    return res.status(429).json({ error: 'Límite de comentarios diarios alcanzado en el sitio. Reintenta mañana.' });
                }
                stat.count += 1;
                await stat.save();
            }

            const comment = await Comment.create({
                content,
                newsId,
                userId: req.user.id
            });

            res.status(201).json(comment);
        } catch (err) {
            res.status(500).json({ error: 'Error al publicar el comentario. Inténtalo más tarde.' });
        }
    }
};

module.exports = commentController;

