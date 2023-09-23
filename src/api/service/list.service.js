const AppError = require('../../util/error/AppError');
const List = require('../model/list.model');

exports.getList = async (param, userId) => {
    if (isDateFormat(param)) {
        const existingList = await List.findOne({
            where: {
                currentDate: param,
            },
        });

        if (existingList) {
            return existingList;
        }
    }

    const newList = await List.create({
        userId,
        currentDate: param,
    });

    return newList;
};

exports.getTodayList = async (userId) => {
    console.log(userId);
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
