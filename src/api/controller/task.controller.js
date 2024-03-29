const AppError = require('../../util/error/AppError');
const CatchError = require('../../util/error/CatchError');
const { roleEnum } = require('../model/role.enum');
const { taskService } = require('../service');

exports.getTask = CatchError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('Please provide taskId!', 400));
    }
    let task;
    if (req.user.role === roleEnum.ADMIN) {
        task = await taskService.getTask(id);
        if (task instanceof AppError) {
            return next(task);
        } else if (task === null) {
            return next(new AppError('Task not found', 400));
        }
    } else {
        task = await taskService.getTask(id);
        if (task instanceof AppError) {
            return next(task);
        } else if (task === null) {
            return next(new AppError('You have no access.', 403));
        }
        if (task.userId !== req.user.id && req.user.role !== roleEnum.ADMIN) {
            return next(new AppError('You have no access.', 403));
        }
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: task,
        },
    });
});

exports.createTask = CatchError(async (req, res, next) => {
    if (!req.body.name || !req.body.listId) {
        return next(new AppError('Please provide all values.', 400));
    }
    if (!req.body.userId) {
        req.body.userId = req.user.id;
    }
    if (req.user.id !== req.body.userId) {
        return next(new AppError('You have no access.', 403));
    }
    const task = await taskService.createTask(req.body, req.user.role);

    console.log(task);
    res.status(201).json({
        status: 'success',
        data: {
            data: task,
        },
    });
});

exports.updateTask = CatchError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('Please provide id!', 400));
    }
    const task = await taskService.getTask(id);
    if (!task) {
        return next(new AppError('Task not found!', 400));
    }

    if (task instanceof AppError) {
        return next(task);
    }
    if (task.userId !== req.user.id && req.user.role !== roleEnum.ADMIN) {
        return next(new AppError('You have no access', 403));
    }
    const updatedTask = await taskService.updateTask(id, req.body, req.user);

    res.status(200).json({
        status: 'success',
        data: {
            data: updatedTask,
        },
    });
});

exports.deleteTask = CatchError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('Please provide id!', 400));
    }

    const data = await taskService.deleteTask(id, req.user);
    if (data instanceof AppError) {
        return next(data);
    }

    res.status(200).json({
        status: 'success',
        data: {
            data,
        },
    });
});
