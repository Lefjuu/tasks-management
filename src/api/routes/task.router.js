const express = require('express');
const { taskController } = require('../controller');
const { localController } = require('../auth/controller');

const router = express.Router();

router.get('/:id', localController.protect, taskController.getTask);
router.post('/', localController.protect, taskController.createTask);

module.exports = router;
