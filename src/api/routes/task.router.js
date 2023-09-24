const express = require('express');
const { taskController } = require('../controller');
const { localController } = require('../auth/controller');

const router = express.Router();

router
    .route('/:id')
    .get(localController.protect, taskController.getTask)
    .patch(localController.protect, taskController.updateTask);

router.use(localController.protect, localController.restrictTo('admin'));

router.post('/', taskController.createTask);
router.delete('/:id', taskController.deleteTask);
module.exports = router;
