const express = require('express');
const { githubController } = require('../controller');

const router = express.Router();

router.get('/github', githubController.index);
router.get('/github/callback', githubController.callback);

module.exports = router;
