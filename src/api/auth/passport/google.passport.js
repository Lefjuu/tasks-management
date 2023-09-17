const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK,
} = require('../../../config/index');
const { User } = require('../../model');

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = new User();
                user = await user.loginBySocial('google', profile);
                user = { ...user.dataValues };

                done(null, user);
            } catch (error) {
                console.log(error);
                done(error);
            }
        },
    ),
);
