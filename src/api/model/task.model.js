// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../../lib/postgres.lib');
// const list = require('./list.model');
// const User = require('./user.model');

// const Task = sequelize.define('tasks', {
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     completed: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//     },
//     // listId: {
//     //     type: DataTypes.STRING,
//     //     allowNull: true,
//     //     unique: true,
//     // },
//     // userId: {
//     //     type: DataTypes.STRING,
//     //     allowNull: true,
//     //     unique: true,
//     // },
// });

// // Task.belongsTo(list, { foreignKey: 'listId' });
// // Task.belongsTo(User, { foreignKey: 'userId' });

// module.exports = Task;
