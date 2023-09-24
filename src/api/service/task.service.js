const listService = require('./list.service');
const AppError = require('../../util/error/AppError');
const Task = require('../model/task.model');

exports.getTask = async (taskId) => {
    return await Task.findByPk(taskId);
};

exports.createTask = async (task) => {
    const createdTask = await Task.create({ ...task });

    console.log(createdTask);
    console.log(createdTask.listId, createdTask.id);

    const adding = await listService.addTaskToList(
        createdTask.listId,
        createdTask.id,
    );
    if (adding instanceof AppError) {
        return next(adding);
    }

    return createdTask;
};
