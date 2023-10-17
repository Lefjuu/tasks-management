const passport = require('passport');
const { initialize } = require('../service/session.service');
const JwtUtils = require('../../../util/jwt');

exports.index = function (req, res, next) {
    passport.authenticate('github')(req, res, next);
};

exports.callback = function (req, res, next) {
    passport.authenticate('github', async function (err, user) {
        if (err) {
            return res.status(500).json({ error: 'Authentication failed.' });
        }

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }
        const accessToken = await JwtUtils.generateAccessToken(user.id);
        const refreshToken = await JwtUtils.generateRefreshToken(user.id);

        return res.redirect(
            `http://localhost:3000/login?accesstoken=${accessToken}&refreshtoken=${refreshToken}`,
        );
    })(req, res, next);
};
