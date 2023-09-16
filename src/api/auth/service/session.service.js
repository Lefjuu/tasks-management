const AppError = require('../../../util/error/AppError');
const JwtUtils = require('../../../util/jwt');

exports.initialize = async function (err, user, res) {
    try {
        if (err) {
            new AppError(err);
        }
        if (!user) {
            new AppError('User not found', 400);
        }

        user._id = user.id;

        // for now idea like this, in future accessToken in cookies and redirect in frontend
        JwtUtils.generateResponseWithTokensAndUser(user, 200, null, res);

        // if local return token
        // if (user.provider === 'local') {
        //     const accessToken = await jwtUtils.generateAccessToken(user.id);
        //     const refreshToken = await jwtUtils.generateRefreshToken(user.id);
        //     return res.status(200).json({ token });
        // }

        // res.redirect(`auth/me`);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
