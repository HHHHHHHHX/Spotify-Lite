const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  _id: String,
  username: String,
  email: String,
  password: String,
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'songs' }],
  followedArtists: [],
  role: {
    type: String,
    default: 'user',
  }
});

const userModel = mongoose.model('users', userSchema);

userModel.register = (newUser) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(4, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(newUser.password, salt, (err, hashString) => {
        if (err) reject(err);
        newUser.password = hashString;
        newUser.save().then(resolve);
      });
    });
  });
};

userModel.login = (password, user) => {
  return new Promise((resovle, reject) => {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) reject(err);
      isMatch ? resovle() : reject('Invalid email or password');
    });
  });
};

userModel.updatePassword = (newPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(4, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(newPassword, salt, (err, hashString) => {
        if (err) reject(err);
        resolve(hashString);
      });
    });
  });
};

module.exports = userModel;
