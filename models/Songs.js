const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  _id: String,
  title: String,
  artist: String,
  album: String,
  genre: String,
  year: Number,
  likedBy: [],
  language: String,
});

const songModel = mongoose.model('songs', songSchema);

module.exports = songModel;
