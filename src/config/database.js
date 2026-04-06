const { Sequelize } = require('sequelize');
require('pg');
require('dotenv').config();

const connString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const sequelize = connString
    ? new Sequelize(connString, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
    : new Sequelize(
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
