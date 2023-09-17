const passport = require('passport');
const { initialize } = require('../service/session.service');

exports.index = function (req, res, next) {
    passport.authenticate('google')(req, res, next);
};

exports.callback = function (req, res, next) {
    passport.authenticate('google', function (err, user) {
        initialize(err, user, res);
    })(req, res, next);
};
