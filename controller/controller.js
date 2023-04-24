const UserModel = require('../models/User');
const SongModel = require('../models/Songs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const validator = require('validator');

const { secretKey } = require('../config/config');

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

// User signup
const userSignup = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!validator.isLength(username, { min: 3, max: 30 })) {
    return res.status(400).json({
      success: false,
      message: 'The length of the username is between 3-30 characters',
    });
  }
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Incorrect email format' });
  }
  if (!validator.isLength(password, { min: 3, max: 30 })) {
    return res.status(400).json({
      success: false,
      message: 'The length of the password is between 3-30 characters',
    });
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }

  // Create new user
  const user = new UserModel({
    _id: uuid.v4(),
    username,
    email,
    password,
    role,
  });
  await UserModel.register(user);

  const token = jwt.sign({ userId: user._id }, secretKey);
  res.cookie('token', token);
  res.status(200).json({ success: true, data: user });
};

// User login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Incorrect email format' });
  }
  if (!validator.isLength(password, { min: 3, max: 30 })) {
    return res.status(400).json({
      success: false,
      message: 'The length of the password is between 3-30 characters',
    });
  }

  // Check if user exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email or password' });
  }
  // Check if password is correct
  UserModel.login(password, user).then(
    () => {
      const token = jwt.sign({ userId: user._id }, secretKey);
      res.cookie('token', token);
      res
        .status(200)
        .json({ success: true, message: 'Login successful', data: user });
    },
    (err) => {
      return res
        .status(400)
        .json({ success: false, message: err || 'Invalid email or password' });
    }
  );
};

// User logout
const userLogout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logout successful' });
};

// get Userinfo
const userInfo = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.userId });
  res.status(200).json({ success: true, user });
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

// update user info
const updateUserInfo = async (req, res) => {
  const { username, password, email } = req.body;

  if (!validator.isLength(username, { min: 3, max: 30 })) {
    return res.status(400).json({
      success: false,
      message: 'The length of the username is between 3-30 characters',
    });
  }
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Incorrect email format' });
  }
  if (!validator.isLength(password, { min: 3, max: 30 })) {
    return res.status(400).json({
      success: false,
      message: 'The length of the password is between 3-30 characters',
    });
  }

  const user = await UserModel.findOne({ _id: req.userId });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email or password' });
  }
  const newPassword = await UserModel.updatePassword(password);
  const result = await UserModel.updateOne(
    { _id: req.userId },
    { username, password: newPassword, email }
  );
  res.status(200).json({ success: true, user: result });
};

const getArtistSongs = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.userId });
  const songs = await SongModel.find().where({ artist: user.username });
  res.status(200).json({ success: true, data: songs });
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

const getArtistFollows = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.userId });
  const followers = await UserModel.find().where({
    followedArtists: { $in: [user.username] },
  });
  res.status(200).json({ success: true, data: followers });
};

module.exports = {
  getUserSongs,
  getUserFollow,
  searchSongs,
  userSignup,
  userLogin,
  userLogout,
  userInfo,
  updateSongLike,
  updateUserInfo,
  updateArtistsFollow,
  getArtistSongs,
  createSong,
  updateSong,
  deleteSong,
  getArtistFollows,
};
