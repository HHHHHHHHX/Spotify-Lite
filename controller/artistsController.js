const UserModel = require('../models/User');
const SongModel = require('../models/Songs');

const getArtistSongs = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.userId });
  const songs = await SongModel.find().where({ artist: user.username });
  res.status(200).json({ success: true, data: songs });
};

const getArtistFollows = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.userId });
  const followers = await UserModel.find().where({
    followedArtists: { $in: [user.username] },
  });
  res.status(200).json({ success: true, data: followers });
};

module.exports = {
  getArtistSongs,
  getArtistFollows,
};
