const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const globalErrorHandler = require('../util/error/ErrorHandler');
const rateLimit = require('express-rate-limit');
const {
    NODE_ENV,
    GOOGLE_SESSION,
    CLIENT_HOSTNAME,
} = require('../config/index.js');
const AppError = require('../util/error/AppError');
const passport = require('passport');
const session = require('express-session');
const {
    localRouter,
    googleRouter,
    githubRouter,
    facebookRouter,
} = require('../api/auth/routes');
const {
    userRouter,
    listRouter,
    taskRouter,
    managementRouter,
} = require('../api/routes');

require('../api/auth/passport/index');

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

    app.use(
        session({
            secret: GOOGLE_SESSION,
            resave: false,
            saveUninitialized: true,
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    const corsOptions = {
        origin: CLIENT_HOSTNAME,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Access-Control-Allow-Headers',
        ],
    };

    app.use(cors(corsOptions));

    if (NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/auth', localRouter);
    app.use('/api/v1/auth', googleRouter);
    app.use('/api/v1/auth', githubRouter);
    app.use('/api/v1/auth', facebookRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/list', listRouter);
    app.use('/api/v1/task', taskRouter);
    app.use('/api/v1/management', managementRouter);

    app.all('*', (req, res, next) => {
        next(
            new AppError(`Can't find ${req.originalUrl} on this server!`, 404),
        );
    });

    app.use(globalErrorHandler);
};

module.exports = { create };
