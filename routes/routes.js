const express = require('express');
const router = express.Router();
const handler = require('../controller/controller');
const auth = require('../middleware/auth');

router.get('/user/songs', auth, handler.getUserSongs);
router.put('/user/songs/like', auth, handler.updateSongLike);
router.get('/user/artists', auth, handler.getUserFollow);
router.put('/user/artists/follow', auth, handler.updateArtistsFollow);

router.get('/songs', auth, handler.searchSongs);
router.post('/songs', auth, handler.createSong);
router.put('/songs', auth, handler.updateSong);
router.delete('/songs', auth, handler.deleteSong);

router.get('/artist/songs', auth, handler.getArtistSongs);
router.get('/artist/follows', auth, handler.getArtistFollows);

router.get('/user', auth, handler.userInfo);
router.put('/user/info', auth, handler.updateUserInfo);
router.post('/user/signup', handler.userSignup);
router.post('/user/login', handler.userLogin);
router.post('/user/logout', auth, handler.userLogout);

module.exports = router;
