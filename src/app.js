const express = require('express');
const { create } = require('./lib/express.lib');
const { db } = require('./lib/postgres.lib.js');
const { User } = require('./api/model');
const app = express();

const init = async () => {
    // express
    await create(app);

    // postgresql
    await db();

    (async () => {
        await User.sync();
    })();
};

module.exports = { init, app };
