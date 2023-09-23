const { DataTypes } = require('sequelize');
const { sequelize } = require('../../lib/postgres.lib');

const List = sequelize.define('lists', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tasks: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
    },
});

module.exports = List;
