const { localService, userService } = require('../service');
const catchError = require('../../../util/error/CatchError');
const AppError = require('../../../util/error/AppError');
const JwtUtils = require('../../../util/jwt');

exports.login = catchError(async (req, res, next) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return next(new AppError('Please provide login and password!', 400));
    }

    const data = await localService.login(login, password);
    if (data instanceof AppError) {
        return next(data);
    }

    return await JwtUtils.generateResponseWithTokensAndUser(
        data,
        200,
        req,
        res,
    );
});

exports.signup = catchError(async (req, res, next) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return next(
            new AppError('Please provide email, name and password!', 400),
        );
    }
    const url = `${req.protocol}://${req.get('host')}/api/v1/auth/verify/`;
    const data = await localService.signup(req.body, url);
    if (data instanceof AppError) {
        return next(data);
    }

    res.status(201).json({
        status: 'success',
        message: 'verification account email sent',
        data: {
            user: data,
        },
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.protect = catchError(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access.',
                401,
            ),
        );
    }

    const decoded = await JwtUtils.decodeAccessToken(token);
    const currentUser = await userService.getUser(decoded.userId);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401,
            ),
        );
    }

    req.user = currentUser;
    next();
});

exports.verify = catchError(async (req, res, next) => {
    const data = await localService.verify(req.params.token);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(200).json({
        status: 'success',
        message: 'Your account has been activated',
    });
});

exports.refresh = catchError(async (req, res, next) => {
    const refreshToken = req.headers.refreshtoken;

    if (!refreshToken) {
        return next(new AppError('Refresh token not provided.', 401));
    }

    const decoded = await JwtUtils.decodeRefreshToken(refreshToken);
    const currentUser = await userService.getUser(decoded.userId);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401,
            ),
        );
    }

    return await JwtUtils.generateResponseWithTokens(
        currentUser,
        200,
        req,
        res,
    );
});

exports.forgotPassword = catchError(async (req, res, next) => {
    if (!req.body.email) {
        return next(new AppError('Please provide email!', 400));
    }
    const url = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/auth/reset-password/`;
    const data = await localService.forgotPassword(req.body.email, url);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(200).json({
        status: 'success',
        message: 'password reset email sent',
    });
});

exports.resetPassword = catchError(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
        return next(
            new AppError('Please provide password and confirm password!', 400),
        );
    }
    const data = await localService.resetPassword(
        req.params.token,
        password,
        confirmPassword,
    );
    if (data instanceof AppError) {
        return next(data);
    }

    return await JwtUtils.generateResponseWithTokensAndUser(
        data,
        200,
        req,
        res,
    );
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403,
                ),
            );
        }
        next();
    };
};

exports.sendVerifyEmail = catchError(async (req, res, next) => {
    const { email } = req.body;
    const url = `${req.protocol}://${req.get('host')}/api/v1/auth/verify/`;
    if (!email) {
        return next(new AppError('Please provide email!', 400));
    }
    const data = await localService.sendVerifyEmail(email, url);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(200).json({
        status: 'success',
        message: 'verify email resend',
    });
});
