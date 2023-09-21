const list = require('./list.model');
const User = require('./user.model');

User.hasMany(list, {
    as: 'lists',
});

list.belongsTo(User, {
    foreignKey: 'userId',
    as: 'users',
});
