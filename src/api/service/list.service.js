const list = require('../model/list.model');

exports.getlist = async (param, userId) => {
    if (isDateFormat(param)) {
        const existinglist = await list.findOne({
            where: {
                currentDate: param,
            },
        });

        if (existinglist) {
            return existinglist;
        }
    } else if (isMongoObjectId(param)) {
        const existinglist = await list.findByPk(param);

        if (existinglist) {
            return existinglist;
        }
    }

    const newlist = await list.create({
        userId,
        currentDate: param,
    });

    return newlist;
};

exports.getTodaylist = async (userId) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, '0')}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentYear}`;

    const existinglist = await list.findOne({
        where: {
            userId: userId,
            currentDate: formattedDate,
        },
    });

    if (!existinglist) {
        const createdlist = await list.create({
            userId,
            currentDate: formattedDate,
        });
        console.log('Created list:', createdlist);
        return createdlist;
    }
    return existinglist;
};
