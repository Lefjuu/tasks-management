const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const globalErrorHandler = require('../util/error/ErrorHandler');
const rateLimit = require('express-rate-limit');
const { NODE_ENV, CLIENT_HOSTNAME } = require('../config/index.js');
const AppError = require('../util/error/AppError');
const passport = require('passport');
const { authRoutes } = require('../api/routes');

const create = async (app) => {
    app.use(helmet());
    app.use(
        bodyParser.json({
            limit: '50mb',
            extended: true,
        }),
    );
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
        rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 100,
            message: 'You have exceeded the requests in 1 minute limit!',
            headers: true,
        }),
    );
    app.use(cookieParser());

    app.use(passport.initialize());
    app.use(passport.session());

    require('../api/auth/passport.auth');

    app.get('/', (req, res) => {
        res.send('<a href="/auth/google">Authenticate with Google </a>');
    });

    app.get(
        '/auth/google',
        passport.authenticate('google', { scope: ['email', 'profile'] }),
    );

    app.get(
        '/google/callback',
        passport.authenticate('google', {
            successRedirect: '/protected',
            failureRedirect: '/auth/failure',
        }),
    );

    app.get('/auth/failure', (req, res) => {
        res.send('Failed');
    });

    app.get('/protected', (req, res) => {
        res.send('Hello');
    });

    // const corsOptions = {
    //     origin: 'http://localhost:3000',
    //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //     credentials: true,
    //     preflightContinue: false,
    //     optionsSuccessStatus: 204,
    //     allowedHeaders: [
    //         'Content-Type',
    //         'Authorization',
    //         'Access-Control-Allow-Headers',
    //     ],
    // };

    // app.use(cors(corsOptions));

    if (NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    app.use('/api/v1/auth', authRoutes);

    app.all('*', (req, res, next) => {
        next(
            new AppError(`Can't find ${req.originalUrl} on this server!`, 404),
        );
    });

    app.use(globalErrorHandler);
};

module.exports = { create };
