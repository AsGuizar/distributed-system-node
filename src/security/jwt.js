const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

const generateToken = (username, userId) => {
  return jwt.sign(
    { username, userId, iat: Math.floor(Date.now() / 1000) },
    config.JWT_SECRET,
    { expiresIn: config.TOKEN_EXPIRATION }
  );
};

const validateToken = (token) => {
  try {
    jwt.verify(token, config.JWT_SECRET);
    return true;
  } catch (err) {
    logger.warn(`Invalid token: ${err.message}`);
    return false;
  }
};

const getUsernameFromToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded ? decoded.username : null;
  } catch (err) {
    return null;
  }
};

const getExpirationFromToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded ? Math.floor(decoded.exp) : 0;
  } catch (err) {
    return 0;
  }
};

module.exports = {
  generateToken,
  validateToken,
  getUsernameFromToken,
  getExpirationFromToken,
};
