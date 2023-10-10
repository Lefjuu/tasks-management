const express = require('express');
const { userController } = require('../controller');
const { localController } = require('../auth/controller');
const { roleEnum } = require('../model/role.enum');

const router = express.Router();

router.get(
    '/me',
    localController.protect,
    localController.getMe,
    userController.getUser,
);

router.use(localController.protect, localController.restrictTo(roleEnum.ADMIN));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(localController.protect, userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
