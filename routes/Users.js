const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const userRole = role('user');

router.get('/user/songs', auth,userRole, userController.getUserSongs);
router.put('/user/songs/like', auth,userRole, userController.updateSongLike);
router.get('/user/artists', auth, userRole,userController.getUserFollow);
router.put('/user/artists/follow', auth, userRole,userController.updateArtistsFollow);

module.exports = router;
