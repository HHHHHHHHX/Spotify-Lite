const UserModel = require('../models/User');
const SongModel = require('../models/Songs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const validator = require('validator');

const { secretKey } = require('../config/config');

//search songs
const searchSongs = async (req, res) => {
  const { page = 1, keyword, language, genre } = req.query;
  const query = {
    $or: [
      { title: { $regex: keyword, $options: 'i' } },
      { artist: { $regex: keyword, $options: 'i' } },
    ],
  };
  if (language) {
    query.language = language;
  }
  if (genre) {
    query.genre = genre;
  }
  //pagination
  const total = await SongModel.count(query);
  const songs = await SongModel.find(query)
    .skip((page - 1) * 5)
    .limit(5);

  res.status(200).json({ success: true, data: songs, total: total });
};

const createSong = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.userId });
  const song = new SongModel({
    artist: user.username,
    _id: uuid.v4(),
    ...req.body,
  });
  await song.save();
  res.status(200).json({ success: true, data: song });
};

const updateSong = async (req, res) => {
  const { _id, ...rest } = req.body;
  const result = await SongModel.updateOne({ _id: _id }, rest);
  res.status(200).json({ success: true, data: result });
};

const deleteSong = async (req, res) => {
  const { id } = req.query;
  const result = await SongModel.deleteOne({ _id: id });
  res.status(200).json({ success: true, data: result });
};

module.exports = {
  searchSongs,
  createSong,
  updateSong,
  deleteSong,
};
