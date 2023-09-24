const express = require('express');
const { create } = require('./lib/express.lib');
const { db } = require('./lib/postgres.lib.js');
const { User, Task, List } = require('./api/model');
const app = express();

const init = async () => {
    // express
    await create(app);

    // postgresql
    await db();

    // temporary
    (async () => {
        await require('./api/model/association.model');
        await User.sync();
        await List.sync();
        await Task.sync();
    })();
};

module.exports = { init, app };
