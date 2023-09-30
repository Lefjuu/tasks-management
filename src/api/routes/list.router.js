const express = require('express');
const { listController, authController } = require('../controller');
const { localController } = require('../auth/controller');

const router = express.Router();

router.get('/today', localController.protect, listController.getTodayList);
router.get(
    '/month/:date',
    localController.protect,
    listController.getMonthList,
);
router.get('/:param', localController.protect, listController.getList);

module.exports = router;
