const { DataTypes } = require('sequelize');
const { sequelize } = require('../../lib/postgres.lib');
const User = require('./user.model');
const Task = require('./task.model');

const list = sequelize.define('lists', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // userId: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: User,
    //         key: 'userId',
    //     },
    // },
    // taskIds: {
    //     type: DataTypes.ARRAY(DataTypes.INTEGER),
    //     references: {
    //         model: Task,
    //         key: 'taskId',
    //     },
    // },

    // taskIds: {
    //     type: DataTypes.ARRAY,
    //     allowNull: true,
    //     unique: true,
    // },
    // userId: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     unique: true,
    // },
});

module.exports = list;
