const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const auth = require('../middleware/auth');

router.get('/user', auth, authController.userInfo);
router.put('/user/info', auth, authController.updateUserInfo);
router.post('/user/signup', authController.userSignup);
router.post('/user/login', authController.userLogin);
router.post('/user/logout', auth, authController.userLogout);

module.exports = router;
