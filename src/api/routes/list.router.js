const express = require('express');
const { listController, authController } = require('../controller');
const { localController } = require('../auth/controller');

const router = express.Router();

router.get('/today', localController.protect, listController.getTodaylist);
router.get('/:param', localController.protect, listController.getlist);

module.exports = router;
