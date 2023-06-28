const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { createUrl, getUrls, getUrl, updateUrl, deleteUrl } = require('../controllers/url');

router.route('/')
    .post(protect, createUrl)
    .get(protect, getUrls);

router.route('/:id')
    .get(protect, getUrl)
    .put(protect, updateUrl)
    .delete(protect, deleteUrl);

module.exports = router;