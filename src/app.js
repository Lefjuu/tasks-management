const express = require('express');
const { create } = require('./lib/express.lib');
const { db } = require('./lib/postgres.lib.js');
const app = express();

const init = async () => {
    // express
    await create(app);

    // postgresql
    await db();
};

module.exports = { init, app };
