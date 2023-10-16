const {
    JWT_SECRET_ACCESS_KEY,
    JWT_SECRET_REFRESH_KEY,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
} = require('../config/index');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
    return jwt.sign({ userId: id }, JWT_SECRET_ACCESS_KEY, {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ userId: id }, JWT_SECRET_REFRESH_KEY, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
};

const generateResponseWithTokensAndUser = async (
    user,
    statusCode,
    req,
    res,
    message,
) => {
    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    const secure = req
        ? req.secure || req.headers['x-forwarded-proto'] === 'https'
        : false;

    if (req) {
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure,
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure,
        });
    }

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        message: message ? message : '',
        refreshToken,
        data: {
            user,
        },
    });
};

const generateResponseWithTokens = async (user, statusCode, req, res) => {
    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        refreshToken,
    });
};

const decodeAccessToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_ACCESS_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

const decodeRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_REFRESH_KEY, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateResponseWithTokensAndUser,
    generateResponseWithTokens,
    decodeAccessToken,
    decodeRefreshToken,
};
