const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Import the Strategy from passport-local
const User = require('../../model/index');

passport.use(
    'local',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            // passReqToCallback: true
        },
        function (username, password, done) {
            User.loginByLocal(username, password)
                .then((user) => done(null, user))
                .catch((err) => done(err));
        },
    ),
);

module.exports = passport; // Export the passport instance
