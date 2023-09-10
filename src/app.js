const express = require('express');
const { create } = require('./lib/express.lib');
const pool = require('./lib/postgres.lib.js');
const app = express();

const init = async () => {
    // express
    await create(app);

    // postgresql
    await pool();
};

module.exports = { init, app };
