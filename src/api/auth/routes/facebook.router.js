const express = require('express');
const { facebookController } = require('../controller');

const router = express.Router();

router.get('/facebook', facebookController.index);
router.get('/facebook/callback', facebookController.callback);

module.exports = router;
