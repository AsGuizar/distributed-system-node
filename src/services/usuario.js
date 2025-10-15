const jwt = require('../security/jwt');
const password = require('../security/password');
const db = require('../db/queries');
const logger = require('../utils/logger');

const Autenticar = async (call, callback) => {
  const { username, password: pwd } = call.request;
  
  logger.info(`Auth attempt: ${username}`);
  
  try {
    const user = await db.getUserByUsername(username);
    
    if (!user) {
      return callback(null, { success: false });
    }
    
    const isValid = await password.comparePassword(pwd, user.password_hash);
    
    if (isValid) {
      logger.info(`Auth success: ${username}`);
      callback(null, { success: true, userId: user.id });
    } else {
      callback(null, { success: false });
    }
  } catch (err) {
    logger.error(`Auth error: ${err.message}`);
    callback(err);
  }
};

const ObtenerToken = async (call, callback) => {
  const { username, password: pwd } = call.request;
  
  logger.info(`Token request: ${username}`);
  
  try {
    const user = await db.getUserByUsername(username);
    
    if (!user) {
      return callback(new Error('Invalid credentials'));
    }
    
    const isValid = await password.comparePassword(pwd, user.password_hash);
    
    if (!isValid) {
      return callback(new Error('Invalid credentials'));
    }
    
    const token = jwt.generateToken(username, user.id);
    const expiresAt = Math.floor(Date.now() / 1000) + 1800;
    
    logger.info(`Token generated: ${username}`);
    callback(null, { token, expiresAt });
  } catch (err) {
    logger.error(`Token error: ${err.message}`);
    callback(err);
  }
};

const VerificarToken = async (call, callback) => {
  const { username: token } = call.request;
  
  try {
    const isValid = jwt.validateToken(token);
    callback(null, { success: isValid, message: isValid ? 'Valid' : 'Invalid' });
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  Autenticar,
  ObtenerToken,
  VerificarToken,
};
