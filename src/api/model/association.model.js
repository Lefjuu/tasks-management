const Timetable = require('./timetable.model');
const User = require('./user.model');

User.hasMany(Timetable, {
    as: 'timetables',
});

Timetable.belongsTo(User, {
    foreignKey: 'userId',
    as: 'users',
});
