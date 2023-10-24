const express = require('express');
const { listController } = require('../controller');
const { localController } = require('../auth/controller');
const { roleEnum } = require('../model/role.enum');

const router = express.Router();

router.get('/today', localController.protect, listController.getTodayList);
router.get(
    '/month',
    localController.protect,
    localController.restrictTo(roleEnum.ADMIN),
    listController.getUserMonthList,
);
router.get(
    '/month/:date',
    localController.protect,
    listController.getMonthList,
);
router.get('/:param', localController.protect, listController.getList);

module.exports = router;
