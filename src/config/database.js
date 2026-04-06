const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.POSTGRES_DATABASE || process.env.PGDATABASE,
    process.env.POSTGRES_USER || process.env.PGUSER,
    process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD,
    {
        host: process.env.POSTGRES_HOST || process.env.PGHOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    }
);

module.exports = sequelize;
