const express = require('express');
const { authController } = require('../controller');
const passport = require('passport');

const router = express.Router();

router.get(
    '/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }),
);

// router.get('/failure', (req, res) => {
//     res.send('Failed');
// });

// router.post('/signup', authController.signup);
// router.post('/google', authController.authGoogle);
// router.post('/login', authController.login);
// router.get('/verify-email', authController.sendVerifyEmail);
// router.post('/verify/:token', authController.verify);
// router.get('/refresh', authController.refresh);

// router.post('/forgot-password', authController.forgotPassword);
// router.patch('/reset-password/:token', authController.resetPassword);

module.exports = router;
