const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, DailyStat } = require('../models');
const { Op } = require('sequelize');



const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Máximo 100 registros diarios. No queremos que nos revienten la base.
            const todayStr = new Date().toISOString().split('T')[0];
            const [stat] = await DailyStat.findOrCreate({
                where: { type: 'user_reg' },
                defaults: { count: 0, lastUpdated: todayStr }
            });

            if (stat.lastUpdated !== todayStr) {
                stat.count = 1;
                stat.lastUpdated = todayStr;
                await stat.save();
            } else {
                if (stat.count >= 100) {
                    return res.status(429).json({ error: 'Límite diario de registros alcanzado. Reintenta mañana.' });
                }
                stat.count += 1;
                await stat.save();
            }

            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ error: 'El usuario ya existe.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });

            res.status(201).json({
                message: 'Usuario registrado correctamente',
                user: { id: user.id, name: user.name, email: user.email }
            });
        } catch (err) {
            console.error('Error al registrar usuario:', err);
            res.status(500).json({ error: 'Error al registrar usuario' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: '1h' }
            );

            res.status(200).json({
                token,
                user: { id: user.id, name: user.name, role: user.role }
            });
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }
};

module.exports = authController;
