const express = require('express');
const { register, login, logout, getMe, forgotPassword, verifyOtp, resetPassword, updatePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile', protect, getMe);
router.put('/updatepassword',protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.post('/verifyotp', verifyOtp);

module.exports = router;