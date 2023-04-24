const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config');

const auth = (req, res, next) => {
  const token = req.cookies['token'];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = auth;
