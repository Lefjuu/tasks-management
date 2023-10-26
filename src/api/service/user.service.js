const { getAsync, setAsync } = require('../../lib/redis.lib');
const AppError = require('../../util/error/AppError');
const { User } = require('../model');
const { roleEnum } = require('../model/role.enum');

exports.getUserWithoutPermission = async (id) => {
    const redisKey = `user:${id}`;

    const userDataFromRedis = await getAsync(redisKey);

    if (userDataFromRedis) {
        const userData = JSON.parse(userDataFromRedis);
        return userData;
    }

    const user = await User.findByPk(id);

    await setAsync(redisKey, JSON.stringify(user));

    return user;
};

exports.getAllUsers = async () => {
    return await User.findAll();
};

exports.getUser = async (id, user) => {
    if (user.role !== roleEnum.ADMIN && parseInt(id) !== user.id) {
        throw new AppError('You have no access', 401);
    }
    return await User.findByPk(id);
};

exports.deleteUser = async (id) => {
    return await User.destroy({
        where: {
            id,
        },
    });
};

exports.updateUser = async (id, body, user) => {
    const updatingUser = await User.findByPk(id);
    if (user.role === roleEnum.ADMIN || user.id === updatingUser.userId) {
        throw new AppError('You have no access', 401);
    }
    if (!updatingUser) {
        throw new AppError('User not found');
    }

    await updatingUser.update(body);

    return updatingUser;
};
