// const { Pool } = require('pg');
// const {
//     POSTGRES_HOSTNAME,
//     POSTGRES_DATABASE,
//     POSTGRES_USERNAME,
//     POSTGRES_PASSWORD,
//     NODE_ENV,
//     POSTGRES_PORT,
// } = require('../config/index.js');

// module.exports = () => {
//     return new Promise((resolve, reject) => {
//         const pool = new Pool({
//             user: POSTGRES_USERNAME,
//             host: POSTGRES_HOSTNAME,
//             database: POSTGRES_DATABASE,
//             password: POSTGRES_PASSWORD,
//             port: POSTGRES_PORT,
//         });

//         if (NODE_ENV === 'development') {
//             pool.on('error', (error) => {
//                 console.error('❌ PostgreSQL: error');
//                 reject(error);
//             });
//         }

//         pool.connect()
//             .then((client) => {
//                 console.log('✔️  PostgreSQL: connected.');
//                 client.release();
//                 resolve();
//             })
//             .catch((error) => {
//                 console.error('❌ PostgreSQL: error');
//                 reject(error);
//             });
//     });
// };

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
        console.log('✔️  Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.original);
    }
};

module.exports = { sequelize, db };
