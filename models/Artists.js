const mongoose = require('mongoose');

const ArtistsSchema = new mongoose.Schema({
  _id: String,
  name: String,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'songs' }],
});

const songModel = mongoose.model('artists', ArtistsSchema);

module.exports = songModel;
