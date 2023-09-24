const AppError = require('../../util/error/AppError');
const CatchError = require('../../util/error/CatchError');
const { listService } = require('../service');

exports.getList = CatchError(async (req, res, next) => {
    const { param } = req.params;
    if (!param) {
        return next(new AppError('Please provide listId!', 400));
    }
    let list;
    if (req.query.user && req.user.role === 'admin') {
        console.log('here');
        list = await listService.getList(param, req.user.id, req.query.user);
        if (list instanceof AppError) {
            return next(list);
        }
    } else {
        list = await listService.getList(param, req.user.id);
        if (list instanceof AppError) {
            return next(list);
        }
        if (list.userId !== req.user.id && req.user.role !== 'admin') {
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

exports.getTodayList = CatchError(async (req, res, next) => {
    const list = await listService.getTodayList(req.user.id);
    if (list instanceof AppError) {
        return next(list);
    }
    if (list.userId !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('You have no access', 403));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: list,
        },
    });
});
