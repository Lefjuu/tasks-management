const { DataTypes } = require('sequelize');
const { sequelize } = require('../../lib/postgres.lib');

const Task = sequelize.define('tasks', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Task;
