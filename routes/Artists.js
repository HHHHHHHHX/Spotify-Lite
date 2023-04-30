const express = require('express');
const router = express.Router();
const artistsController = require('../controller/artistsController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const artistRole = role('artist');


router.get('/artist/songs', auth,artistRole, artistsController.getArtistSongs);
router.get('/artist/follows', auth, artistRole,artistsController.getArtistFollows);

module.exports = router;
