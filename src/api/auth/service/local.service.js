const AppError = require('../../../util/error/AppError');
const Email = require('../../../util/email.js');
const { User } = require('../../model');
const crypto = require('crypto');

exports.login = async (login, password) => {
    const user = await User.findOne({
        where: {
            username: login,
        },
        attributes: { exclude: ['password'] },
    });

    if (!user || !(await user.correctPassword(password, user.password))) {
        return new AppError('Incorrect login or password', 401);
    } else if (!user.active) {
        return new AppError('Verify your account', 401);
    } else {
        return user;
    }
};

exports.signup = async (newUser, url) => {
    const exists = await User.findOne({
        where: { email: newUser.email },
    });
    if (exists) {
        return new AppError(`${newUser.email} is already registered`, 400);
    } else {
        const user = await User.create(newUser);

        const urlWithToken = url + user.verifyToken;

        await new Email(newUser, urlWithToken).sendVerificationToken();
        const { password, __v, active, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }
};

exports.me = async (userId) => {
    const user = await User.findById(userId);

    return user;
};

exports.verify = async (token) => {
    const user = await User.findOne({
        where: {
            verifyToken: token,
        },
    });

    if (!user || user.verifyTokenExpires < new Date()) {
        return new AppError(`Token expired`, 400);
    }

    await User.update(
        { active: true },
        {
            where: {
                id: user.id,
            },
        },
    );

    return user;
};

exports.forgotPassword = async (email, url) => {
    const user = await User.findOne({ email });
    if (!user) {
        return new AppError('There is no user with this email address.', 400);
    }

    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        const resetURL = url + resetToken;
        await new Email(user, resetURL).sendPasswordReset();
        return true;
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return new AppError(
            'There was an error sending the email. Try again later!',
            500,
        );
    }
};

exports.resetPassword = async (token, password, confirmPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return new AppError('Token is invalid or has expired', 400);
    }
    user.password = password;
    user.passwordConfirm = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return user;
};

exports.sendVerifyEmail = async (email, url) => {
    let user = await User.findOne({ email });
    if (!user) {
        return new AppError('There is no user with this email address.', 400);
    }
    const activationToken = crypto.randomBytes(32).toString('hex');
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 1);
    const verifyToken = crypto
        .createHash('sha256')
        .update(activationToken)
        .digest('hex');
    await User.update(
        { verifyTokenExpires: expirationTime, verifyToken },
        { where: { email } },
    );

    const urlWithToken = url + verifyToken;

    await new Email(user, urlWithToken).sendVerificationToken();
    return true;
};
