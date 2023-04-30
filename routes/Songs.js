const express = require('express');
const router = express.Router();
const songsController = require('../controller/songsController');
const auth = require('../middleware/auth');

router.get('/songs', auth, songsController.searchSongs);
router.post('/songs', auth, songsController.createSong);
router.put('/songs', auth, songsController.updateSong);
router.delete('/songs', auth, songsController.deleteSong);

module.exports = router;
