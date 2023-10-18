const { Task, List, User } = require('../model');
const { roleEnum } = require('../model/role.enum');
const { Op } = require('sequelize');

exports.getStats = async () => {
    const employeeCount = await User.count({
        where: {
            role: {
                [Op.eq]: roleEnum.EMPLOYEE,
            },
        },
    });
    const taskCount = await Task.count();
    const listCount = await List.count();

    return {
        employeeCount,
        taskCount,
        listCount,
    };
};
