const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('../security/jwt');
const db = require('../db/queries');
const logger = require('../utils/logger');
const config = require('../config');

fs.mkdir(config.STORAGE_PATH, { recursive: true }).catch(() => {});

const SubirArchivo = async (call, callback) => {
  logger.info('Upload initiated');
  callback(null, { fileId: uuidv4(), checksum: 'abc123' });
};

const DescargarArchivo = async (call, callback) => {
  const { fileId, token } = call.request;
  
  try {
    if (!jwt.validateToken(token)) {
      return callback(new Error('Unauthorized'));
    }
    
    const filePath = path.join(config.STORAGE_PATH, fileId);
    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    
    if (!exists) {
      return callback(new Error('Not found'));
    }
    
    const data = await fs.readFile(filePath);
    const stats = await fs.stat(filePath);
    
    call.write({
      metadata: {
        fileId,
        filename: fileId,
        size: stats.size,
        checksum: 'abc123',
      },
    });
    
    const chunkSize = 1024 * 1024;
    for (let i = 0; i < data.length; i += chunkSize) {
      call.write({
        chunk: data.slice(i, i + chunkSize),
      });
    }
    
    call.end();
    logger.info(`Downloaded: ${fileId}`);
  } catch (err) {
    logger.error(`Download error: ${err.message}`);
    callback(err);
  }
};

const EliminarArchivo = async (call, callback) => {
  const { fileId, token } = call.request;
  
  try {
    if (!jwt.validateToken(token)) {
      return callback(new Error('Unauthorized'));
    }
    
    await db.deleteFile(fileId);
    const filePath = path.join(config.STORAGE_PATH, fileId);
    await fs.unlink(filePath).catch(() => {});
    
    logger.info(`Deleted: ${fileId}`);
    callback(null, { success: true });
  } catch (err) {
    logger.error(`Delete error: ${err.message}`);
    callback(err);
  }
};

const ListarArchivos = async (call, callback) => {
  const { token, limit } = call.request;
  
  try {
    if (!jwt.validateToken(token)) {
      return callback(new Error('Unauthorized'));
    }
    
    const files = await db.listFiles(limit || 10);
    callback(null, { files });
  } catch (err) {
    logger.error(`List error: ${err.message}`);
    callback(err);
  }
};

module.exports = {
  SubirArchivo,
  DescargarArchivo,
  EliminarArchivo,
  ListarArchivos,
};
