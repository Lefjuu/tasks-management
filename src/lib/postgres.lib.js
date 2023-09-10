const { Pool } = require('pg');
const {
    POSTGRES_HOSTNAME,
    POSTGRES_DATABASE,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    NODE_ENV,
    POSTGRES_PORT,
} = require('../config/index.js');

module.exports = () => {
    return new Promise((resolve, reject) => {
        const pool = new Pool({
            user: POSTGRES_USERNAME,
            host: POSTGRES_HOSTNAME,
            database: POSTGRES_DATABASE,
            password: POSTGRES_PASSWORD,
            port: POSTGRES_PORT,
        });

        if (NODE_ENV === 'development') {
            pool.on('error', (error) => {
                console.error('❌ PostgreSQL: error');
                reject(error);
            });
        }

        pool.connect()
            .then((client) => {
                console.log('✔️  PostgreSQL: connected.');
                client.release();
                resolve();
            })
            .catch((error) => {
                console.error('❌ PostgreSQL: error');
                reject(error);
            });
    });
};
