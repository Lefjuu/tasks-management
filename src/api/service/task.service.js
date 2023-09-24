const listService = require('./list.service');
const AppError = require('../../util/error/AppError');
const Task = require('../model/task.model');

exports.getTask = async (taskId) => {
    return await Task.findByPk(taskId);
};

exports.createTask = async (task, role) => {
    const list = await listService.findList(task.listId);
    if (list.userId !== task.userId && role !== 'admin') {
        throw new AppError('You have no access', 401);
    }
    const createdTask = await Task.create({ ...task });

    const adding = await listService.addTaskToList(task.listId, task.id);
    if (adding instanceof AppError) {
        return next(adding);
    }

    return createdTask;
};
