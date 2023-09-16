const express = require('express');
const controller = require('./../controller/google.controller');

const router = express.Router();

router.get('/auth/google', controller.index);
router.get('/auth/google/callback', controller.callback);

module.exports = router;
