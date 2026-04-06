const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyStat = sequelize.define('DailyStat', {
    type: {
        type: DataTypes.STRING, // 'user_reg' o 'comment_post'
        allowNull: false,
        unique: true
    },
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastUpdated: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

module.exports = DailyStat;
