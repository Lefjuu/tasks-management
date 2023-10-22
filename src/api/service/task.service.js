const listService = require('./list.service');
const AppError = require('../../util/error/AppError');
const Task = require('../model/task.model');
const { roleEnum } = require('../model/role.enum');

exports.getTask = async (taskId) => {
    return await Task.findByPk(taskId);
};

exports.createTask = async (task, role) => {
    const list = await listService.findList(task.listId);
    if (list.userId !== task.userId && role !== roleEnum.ADMIN) {
        throw new AppError('You have no access', 401);
    }

    task.userId = list.userId;
    const createdTask = await Task.create({ ...task });

    const adding = await listService.addTaskToList(task.listId, createdTask.id);
    if (adding instanceof AppError) {
        return next(adding);
    }

    return createdTask;
};

exports.updateTask = async (id, body, user) => {
    try {
        const task = await Task.findByPk(id);

        if (!task) {
            throw new AppError('Task not found', 400);
        }

        let updatedTask;
        if (user.role === roleEnum.ADMIN || task.userId === user.id) {
            updatedTask = await task.update(body, {
                where: { id: task.id },
                returning: true,
                plain: true,
            });
        } else {
            updatedTask = await task.update(
                {
                    ended: body.ended,
                    description: body.description,
                },
                {
                    where: { id: task.id },
                    returning: true,
                    plain: true,
                },
            );
        }

        return updatedTask;
    } catch (error) {
        throw error;
    }
};

exports.deleteTask = async (id, user) => {
    try {
        const task = await Task.findByPk(id);

        if (!task) {
            return false;
        }
        let isDeleted;
        if (user.role === roleEnum.ADMIN || task.userId === user.id) {
            isDeleted = await Task.destroy({
                where: { id: task.id },
            });
            await listService.deleteTaskInList(task.listId, task.id);
        }

        if (isDeleted === 0) {
            return false;
        }

        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.findTasksForDay = async (userId, listId) => {
    const tasks = await Task.findAll({
        where: {
            userId: userId,
            listId: listId,
        },
        attributes: ['name', 'id', 'description'],
    });

    return tasks;
};
