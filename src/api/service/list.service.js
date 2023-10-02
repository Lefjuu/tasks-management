const AppError = require('../../util/error/AppError');
const List = require('../model/list.model');
const taskService = require('./task.service');

function isDateFormat(input) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    return dateRegex.test(input);
}

exports.getList = async (param, userId, employeeId) => {
    console.log('param:', param);
    console.log('userId:', userId);
    console.log('employeeId:', employeeId);
    let list;
    if (isDateFormat(param) && employeeId) {
        list = await List.findOne({
            where: {
                userId: employeeId,
                name: param,
            },
        });
    } else if (isDateFormat(param)) {
        list = await List.findOne({
            where: {
                name: param,
                userId: userId,
            },
        });
    } else {
        throw new AppError('Bad Request', 400);
    }

    if (!list) {
        list = await List.create({
            userId,
            name: param,
        });
    }

    return list;
};

exports.getTodayList = async (userId) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, '0')}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentYear}`;

    const existingList = await List.findOne({
        where: {
            userId: userId,
            name: formattedDate,
        },
    });

    if (!existingList) {
        const createdList = await List.create({
            userId,
            name: formattedDate,
        });
        return createdList;
    }
    return existingList;
};

exports.addTaskToList = async (listId, taskId) => {
    const list = await List.findByPk(listId);

    if (!list) {
        throw new AppError('List not found', 400);
    }
    list.tasks = [...list.tasks, taskId];

    await list.save();

    return list;
};

exports.findList = async (listId) => {
    return await List.findByPk(listId);
};

exports.getMonthList = async (userId, params) => {
    const [month, year] = params.date.split('-');

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    const lists = [];

    for (
        let currentDate = new Date(firstDayOfMonth);
        currentDate <= lastDayOfMonth;
        currentDate.setDate(currentDate.getDate() + 1)
    ) {
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        let list = await List.findOne({
            where: {
                userId: userId,
                name: formattedDate,
            },
        });

        if (!list) {
            list = await List.create({
                userId,
                name: formattedDate,
            });
        }

        const tasks = await taskService.findTasksForDay(userId, list.id);
        list.tasks = tasks;

        lists.push(list);
    }

    return lists;
};

exports.deleteTaskInList = async (listId, taskId) => {
    const list = await List.findByPk(listId);

    if (!list) {
        throw new AppError('List not found', 400);
    }
    list.tasks = [...list.tasks, taskId];

    await list.save();

    return list;
};
