const AppError = require('../../util/error/AppError');
const CatchError = require('../../util/error/CatchError');
const { listService } = require('../service');

exports.getlist = CatchError(async (req, res, next) => {
    const { param } = req.params;
    if (!param) {
        return next(new AppError('Please provide listId!', 400));
    }
    let list;
    if (req.query.user && req.user.role === 'admin') {
        list = await listService.getlist(param, req.user._id, req.query.user);
        if (list instanceof AppError) {
            return next(list);
        }
    } else {
        list = await listService.getlist(param, req.user._id);
        if (list instanceof AppError) {
            return next(list);
        }
        if (
            list.userId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return next(new AppError('You have no access', 403));
        }
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: list,
        },
    });
});

exports.getTodaylist = CatchError(async (req, res, next) => {
    const list = await listService.getTodaylist(req.user._id);
    if (list instanceof AppError) {
        return next(list);
    }
    if (
        list.userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return next(new AppError('You have no access', 403));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: list,
        },
    });
});