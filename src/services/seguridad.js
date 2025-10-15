const jwt = require('../security/jwt');
const logger = require('../utils/logger');

const ValidarToken = async (call, callback) => {
  const { username: token } = call.request;
  
  logger.debug('Token validation');
  
  try {
    const isValid = jwt.validateToken(token);
    const username = isValid ? jwt.getUsernameFromToken(token) : '';
    const expiresAt = isValid ? jwt.getExpirationFromToken(token) : 0;
    
    callback(null, { valido: isValid, usuario: username, expiraEn: expiresAt });
  } catch (err) {
    logger.error(`Validation error: ${err.message}`);
    callback(err);
  }
};

const VerificarPermiso = async (call, callback) => {
  const { token } = call.request;
  
  try {
    const isValid = jwt.validateToken(token);
    callback(null, {
      success: isValid,
      message: isValid ? 'Granted' : 'Denied',
    });
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  ValidarToken,
  VerificarPermiso,
};
