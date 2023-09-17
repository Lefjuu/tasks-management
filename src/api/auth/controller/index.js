const localController = require('./local.controller');
const googleController = require('./google.controller');
const githubController = require('./github.controller');
const facebookController = require('./facebook.controller');

module.exports = {
    localController,
    googleController,
    githubController,
    facebookController,
};
