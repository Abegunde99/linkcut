const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { createUrl, getUrls, getUrl, updateUrl, deleteUrl , generateUrl, getUrlForUnregisteredUser} = require('../controllers/url');

router.route('/urls')
    .post(protect, createUrl)
    

router.route('/urls/:id')
    .get(protect, getUrl)
    .put(protect, updateUrl)
    .delete(protect, deleteUrl);

router.route('/url/user')
    .get(protect, getUrls);

router.route('/urls/generate')
    .post(generateUrl);

router.route('/url/:userId')
    .get(getUrlForUnregisteredUser);
module.exports = router;