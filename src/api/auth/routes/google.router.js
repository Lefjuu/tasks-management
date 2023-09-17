const express = require('express');
const { googleController } = require('../controller');

const router = express.Router();

router.get('/google', googleController.index);
router.get('/google/callback', googleController.callback);

module.exports = router;
