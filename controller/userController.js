const UserModel = require('../models/User');

const getUserSongs = async (req, res) => {
  const userData = await UserModel.findOne({ _id: req.userId }).populate(
    'likedSongs'
  );
  res.status(200).json({ success: true, data: userData.likedSongs });
};

const getUserFollow = async (req, res) => {
  const userData = await UserModel.findOne({ _id: req.userId });
  res.status(200).json({ success: true, data: userData.followedArtists });
};

// user like|unlike a song
const updateSongLike = async (req, res) => {
  const { songId, songIds, unlike } = req.body;
  const user = await UserModel.findOne({ _id: req.userId });
  let data;
  if (unlike) {
    data = (user.likedSongs || []).filter((iv) => {
      if (iv.toString() == songId) {
        return false;
      }
      if ((songIds || []).includes(iv.toString())) {
        return false;
      }
      return true;
    });
  } else {
    data = user.likedSongs || [];
    if (!data.includes(songId)) {
      data.push(songId);
    }
  }
  const result = await UserModel.updateOne(
    { _id: req.userId },
    { likedSongs: data }
  );
  res.status(200).json({ success: true, user: result });
};

// user follow|unfollow a artist
const updateArtistsFollow = async (req, res) => {
  const { follow, unlike } = req.body;
  const user = await UserModel.findOne({ _id: req.userId });
  let data;
  if (unlike) {
    data = (user.followedArtists || []).filter((iv) => iv !== follow);
  } else {
    data = user.followedArtists || [];
    if (!data.includes(follow)) {
      data.push(follow);
    }
  }
  const result = await UserModel.updateOne(
    { _id: req.userId },
    { followedArtists: data }
  );
  res.status(200).json({ success: true, user: result });
};

module.exports = {
  getUserSongs,
  getUserFollow,
  updateSongLike,
  updateArtistsFollow,
};
