const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const validator = require('validator');

const { secretKey } = require('../config/config');

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

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  userInfo,
  updateUserInfo,
};
