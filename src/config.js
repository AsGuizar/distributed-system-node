require('dotenv').config();

module.exports = {
  SERVICE_TYPE: process.env.SERVICE_TYPE || 'SECURITY',
  SERVICE_PORT: parseInt(process.env.SERVICE_PORT) || 50051,
  
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || 'dist_db',
  DB_USER: process.env.DB_USER || 'admin',
  DB_PASSWORD: process.env.DB_PASSWORD || 'admin123',
  
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key',
  TOKEN_EXPIRATION: 1800,
  
  STORAGE_PATH: process.env.STORAGE_PATH || '/tmp/storage',
  NODE_ID: process.env.NODE_ID || 'node-unknown',
  
  SECURITY_HOST: process.env.SECURITY_HOST || 'localhost',
  SECURITY_PORT: parseInt(process.env.SECURITY_PORT) || 50051,
};
