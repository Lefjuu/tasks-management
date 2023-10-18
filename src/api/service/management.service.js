const { Task, List, User } = require('../model');

exports.getStats = async () => {
    const employeeCount = await User.count();
    const taskCount = await Task.count();
    const listCount = await List.count();

    return {
        employeeCount,
        taskCount,
        listCount,
    };
};
