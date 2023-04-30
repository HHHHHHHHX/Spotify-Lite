const UserModel = require('../models/User');

const role = (role) => async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: 'No token, authorization denied' });
  }

  const user = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User dont exists',
    });
  }

  if (user.role === role) {
    next();
  } else {
    res
      .status(401)
      .json({ success: false, message: 'The user role is incorrect' });
  }
};

module.exports = role;
