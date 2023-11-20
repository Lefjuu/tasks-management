const { Sequelize } = require('sequelize');
const {
    POSTGRES_HOSTNAME,
    POSTGRES_DATABASE,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    NODE_ENV,
    POSTGRES_PORT,
} = require('../config/index.js');

const sequelize = new Sequelize(
    POSTGRES_DATABASE,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    {
        host: POSTGRES_HOSTNAME,
        port: POSTGRES_PORT,
        dialect: 'postgres',
        logging: NODE_ENV === 'development' ? console.log : false,
    },
);

const db = async () => {
    try {
        await sequelize.authenticate();
        // require('../api/model/association.model.js');
        // await sequelize.authenticate();
        // await sequelize.sync({ force: false });
        console.log('✔️  Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, db };
