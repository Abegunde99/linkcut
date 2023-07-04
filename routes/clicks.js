const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getClicks, getClicksByUrlId, clickUrl } = require('../controllers/clicks');

router.route('/clicks')
    .get(protect, getClicks);

router.route('/clicks/:urlId')
    .get(protect, getClicksByUrlId);

router.route('/:urlCode')
    .get(clickUrl);

router.route('/user/clicks')
    .get(protect, getClicks);
module.exports = router;