const fs = require('fs').promises;
const path = require('path');
const db = require('../db/queries');
const logger = require('../utils/logger');
const config = require('../config');

const ObtenerEstado = async (call, callback) => {
  try {
    const storagePath = config.STORAGE_PATH;
    const files = await fs.readdir(storagePath).catch(() => []);
    
    let totalSize = 0;
    for (const file of files) {
      const stat = await fs.stat(path.join(storagePath, file));
      totalSize += stat.size;
    }
    
    callback(null, {
      nodeId: config.NODE_ID,
      address: 'localhost',
      port: config.SERVICE_PORT,
      disponible: true,
      archivosAlmacenados: files.length,
      espacioUsado: totalSize,
      ultimoHeartbeat: Math.floor(Date.now() / 1000),
    });
  } catch (err) {
    logger.error(`Status error: ${err.message}`);
    callback(err);
  }
};

const SincronizarArchivo = async (call, callback) => {
  const { fileId, data } = call.request;
  
  try {
    const filePath = path.join(config.STORAGE_PATH, fileId);
    await fs.writeFile(filePath, data);
    
    logger.info(`Synced: ${fileId}`);
    callback(null, { success: true });
  } catch (err) {
    logger.error(`Sync error: ${err.message}`);
    callback(err);
  }
};

const EstaDisponible = async (call, callback) => {
  try {
    callback(null, { success: true, message: `${config.NODE_ID} available` });
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  ObtenerEstado,
  SincronizarArchivo,
  EstaDisponible,
};
