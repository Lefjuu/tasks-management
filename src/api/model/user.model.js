const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import your Sequelize instance

const User = sequelize.define(
    'User',
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('employee', 'forwarder', 'admin'),
            defaultValue: 'employee',
        },
        passwordChangedAt: DataTypes.DATE,
        passwordResetToken: DataTypes.STRING,
        passwordResetExpires: DataTypes.DATE,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verifyToken: DataTypes.STRING,
        verifyTokenExpires: DataTypes.DATE,
    },
    {
        hooks: {
            beforeCreate: async (user) => {
                const baseUsername =
                    user.name.split(' ')[0].charAt(0) + user.name.split(' ')[1];
                let username = baseUsername;
                let count = 1;

                while (true) {
                    const usernameExists = await User.findOne({
                        where: { username },
                    });

                    if (!usernameExists) {
                        break;
                    }

                    count++;
                    username = baseUsername + count;
                }

                user.username = username;

                const activationToken = crypto.randomBytes(32).toString('hex');

                user.verifyToken = crypto
                    .createHash('sha256')
                    .update(activationToken)
                    .digest('hex');
                user.verifyTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
                user.password = await bcrypt.hash(user.password, 12);
            },
            beforeUpdate: function (user) {
                if (user.changed('password')) {
                    user.passwordChangedAt = new Date() - 1000;
                }
            },
        },
    },
);

User.prototype.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );
        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

User.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
};

module.exports = User;
