const { User } = require('../../model');

exports.getUser = async (id) => {
    console.log(id);
    return await User.findByPk(id);
};

exports.getAllUsers = async () => {
    return await User.findAll();
};

exports.createUser = async (user) => {
    return await User.create(user);
};

exports.deleteUser = async (id) => {
    return await User.destroy({
        where: {
            id,
        },
    });
};

exports.updateUser = async (id, body) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error('User not found');
    }

    await user.update(body);

    return user;
};
