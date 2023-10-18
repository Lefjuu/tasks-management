const express = require('express');
const { managementController } = require('../controller');
const { localController } = require('../auth/controller');
const { roleEnum } = require('../model/role.enum');

const router = express.Router();

router.get(
    '/stats',
    localController.protect,
    localController.restrictTo(roleEnum.ADMIN),
    managementController.getStats,
);

module.exports = router;
