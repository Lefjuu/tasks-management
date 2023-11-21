const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const serverless = require('serverless-http');
const { db } = require('./lib/postgres.lib.js');
const { redisClient } = require('./lib/redis.lib.js');

// Your configurations
const {
    NODE_ENV,
    GOOGLE_SESSION,
    CLIENT_HOSTNAME,
    SERVER_HOSTNAME,
    SERVER_PORT,
} = require('./config/index.js');

// Your models and routers
const { User, Task, List } = require('./api/model');
const {
    userRouter,
    listRouter,
    taskRouter,
    managementRouter,
} = require('./api/routes');

const {
    googleRouter,
    localRouter,
    githubRouter,
    facebookRouter,
} = require('./api/auth/routes/index.js');

const app = express();

// Middleware setup
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
    origin: '*',
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

app.get('/', (req, res) => {
    res.send('Task Management API');
});

app.use('/api/v1/auth', localRouter);
app.use('/api/v1/auth', googleRouter);
app.use('/api/v1/auth', githubRouter);
app.use('/api/v1/auth', facebookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/list', listRouter);
app.use('/api/v1/task', taskRouter);
app.use('/api/v1/management', managementRouter);

app.all('*', (req, res) => {
    res.status(404).send(`Can't find ${req.originalUrl} on this server!`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server initialization
const init = async () => {
    try {
        await db();

        // redis
        await redisClient.connect();

        // Temporary
        await User.sync();
        await List.sync();
        await Task.sync();
    } catch (err) {
        console.error(err);
    }
};

init();

app.listen(SERVER_PORT, () => {
    console.log(
        `✔️  Server is ready.
    \nmode: ${NODE_ENV}
    \nserver: http://${SERVER_HOSTNAME}:${SERVER_PORT}`,
    );
});

// Serverless handler
module.exports.handler = serverless(app);
