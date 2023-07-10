const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { createUrl, getUrls, getUrl, updateUrl, deleteUrl } = require('../controllers/url');

router.route('/urls')
    .post(protect, createUrl)
    

router.route('/urls/:id')
    .get(protect, getUrl)
    .put(protect, updateUrl)
    .delete(protect, deleteUrl);

router.route('/url/user')
    .get(protect, getUrls);
module.exports = router;