const express = require('express');
const { localController } = require('../controller');
const passport = require('passport');

const router = express.Router();

router.post('/signup', localController.signup);
router.post('/login', localController.login);
router.get('/verify-email', localController.sendVerifyEmail);
router.post('/verify/:token', localController.verify);
router.get('/refresh', localController.refresh);

router.post('/forgot-password', localController.forgotPassword);
router.patch(
    '/new-password',
    localController.protect,
    localController.newPassword,
);
router.patch('/reset-password/:token', localController.resetPassword);

module.exports = router;
