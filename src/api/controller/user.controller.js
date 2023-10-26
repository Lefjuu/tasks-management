const AppError = require('../../util/error/AppError');
const CatchError = require('../../util/error/CatchError');
const UserService = require('../service/user.service');

exports.getUser = CatchError(async (req, res, next) => {
    const user = await UserService.getUser(req.params.id, req.user);
    if (!user) {
        return next(new AppError('User not found with that ID', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: user,
        },
    });
});

exports.getAllUsers = CatchError(async (req, res, next) => {
    const users = await UserService.getAllUsers();
    if (!users) {
        return next(new AppError('Users not found', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: users,
        },
    });
});

exports.createUser = CatchError(async (req, res, next) => {
    const user = await UserService.createUser(req.body);
    if (user instanceof AppError) {
        return next(user);
    }
    res.status(201).json({
        status: 'success',
        data: {
            data: user,
        },
    });
});

exports.deleteUser = CatchError(async (req, res, next) => {
    const user = await UserService.deleteUser(req.params.id);
    if (user instanceof AppError) {
        return next(user);
    }
    if (!user) {
        return next(new AppError('User not found', 400));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.updateUser = CatchError(async (req, res, next) => {
    if (req.body.password) {
        return next(new AppError(`Don't update password!`, 400));
    }
    const user = await UserService.updateUser(
        req.params.id,
        req.body,
        req.user,
    );
    if (!user) {
        return next(new AppError('User not found', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: user,
        },
    });
});
