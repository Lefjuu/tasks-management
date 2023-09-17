const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../../model');
const {
    FACEBOOK_CALLBACK,
    FACEBOOK_CLIENT_SECRET,
    FACEBOOK_CLIENT_ID,
} = require('../../../config');

passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
            callbackURL: FACEBOOK_CALLBACK,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                let user = new User();
                user = await user.loginBySocial('facebook', profile);
                console.log(user);
                // if (user instanceof AppError) {
                //     return done(user);
                // }
                user = { ...user.dataValues };

                done(null, user);
            } catch (error) {
                console.log(error);
                done(error);
            }
        },
    ),
);
