const express = require('express');
const { taskController } = require('../controller');
const { localController } = require('../auth/controller');

const router = express.Router();

router
    .route('/:id')
    .get(localController.protect, taskController.getTask)
    .patch(localController.protect, taskController.updateTask)
    .delete(localController.protect, taskController.deleteTask);

router.post('/', localController.protect, taskController.createTask);

module.exports = router;
