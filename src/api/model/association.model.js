const List = require('./list.model');
const Task = require('./task.model');
const User = require('./user.model');

User.hasMany(List, {
    foreignKey: 'userId',
    as: 'lists',
});

List.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

List.hasMany(Task, {
    foreignKey: 'listId',
    as: 'taskList',
});

Task.belongsTo(List, {
    foreignKey: 'listId',
    as: 'list',
});

Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'taskUser',
});
