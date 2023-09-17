const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy; // Import the Strategy from passport-github
const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK,
} = require('../../../config');
const { User } = require('../../model');

passport.use(
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_CALLBACK,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = new User();
                user = await user.loginBySocial('github', profile);
                user = { ...user.dataValues };

                done(null, user);
            } catch (error) {
                console.log(error);
                done(error);
            }
        },
    ),
);
