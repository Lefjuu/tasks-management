const AppError = require('../../util/error/AppError');
const List = require('../model/list.model');

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
