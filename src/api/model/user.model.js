const { DataTypes } = require('sequelize');
const { sequelize } = require('../../lib/postgres.lib');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AppError = require('../../util/error/AppError');

const User = sequelize.define(
    'users',
    {
        email: {
            type: DataTypes.STRING,
            allowNull: true,
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
        provider: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'local',
        },
        socialId: {
            type: DataTypes.STRING,
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
            async beforeCreate(user) {
                let baseUsername;
                if (
                    user.name.split(' ')[0].charAt(0) &&
                    user.name.split(' ')[1]
                ) {
                    baseUsername =
                        user.name.split(' ')[0].charAt(0) +
                        user.name.split(' ')[1];
                } else {
                    baseUsername = user.name.split(' ')[0].charAt(0);
                }

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

                if (user.provider === 'local') {
                    user.username = username;

                    const activationToken = crypto
                        .randomBytes(32)
                        .toString('hex');

                    user.verifyToken = crypto
                        .createHash('sha256')
                        .update(activationToken)
                        .digest('hex');

                    const expirationTime = new Date();
                    user.verifyTokenExpires.setDate(
                        expirationTime.getDate() + 1,
                    );
                } else {
                    user.active = true;
                }
                user.password = await bcrypt.hash(user.password, 12);
            },
            beforeUpdate(user) {
                if (user.changed('password')) {
                    user.passwordChangedAt = new Date() - 1000;
                }
            },
        },
    },
);

User.prototype.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
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

User.prototype.loginByLocal = async function (username, password) {
    try {
        const user = await User.findOne({
            where: {
                username: username,
                provider: 'local',
            },
        });

        if (!user) {
            throw new Error(`${username}' is not registered.`);
        }

        const isMatch = await user.correctPassword(password);

        if (!isMatch) {
            throw new Error(`This password is not correct.`);
        }

        user.lastLogin = Date.now();

        return await user.save();
    } catch (error) {
        throw error;
    }
};

User.prototype.loginBySocial = async function (provider, profile) {
    console.log(profile);
    try {
        let user = await User.findOne({
            where: {
                provider,
                socialId: profile.id,
            },
        });

        // // if (provider === 'facebook') {
        // const emailExists = await User.findOne({
        //     where: { email: profile.email },
        // });

        // if (emailExists) {
        //     throw new AppError('Email address is already in use.', 400);
        // }
        // // }

        if (!user) {
            user = await User.create({
                provider: provider,
                name: profile.displayName,
                email: profile.email || null,
                socialId: profile.id,
                password: 'social_login_password',
            });
        }

        user = await user.save();
        // console.log(user);
        // if (user instanceof AppError) {
        //     throw new AppError('Email address is already in use.', 400);
        // }
        return user;
    } catch (error) {
        throw error;
    }
};

module.exports = User;
