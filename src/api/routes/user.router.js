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

// router.use(localController.protect);

router
    .route('/')
    .get(
        localController.protect,
        localController.restrictTo(roleEnum.ADMIN),
        userController.getAllUsers,
    );

router
    .route('/:id')
    .get(localController.protect, userController.getUser)
    .patch(localController.protect, userController.updateUser)
    .delete(
        localController.protect,
        localController.restrictTo(roleEnum.ADMIN),
        userController.deleteUser,
    );

module.exports = router;
