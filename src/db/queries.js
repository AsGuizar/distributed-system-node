const pool = require('./pool.js');

// User queries
const getUserByUsername = async (username) => {
  const result = await pool.query(
    'SELECT id, password_hash FROM usuarios WHERE username = $1',
    [username]
  );
  return result.rows[0];
};

const createUser = async (username, passwordHash, email) => {
  const result = await pool.query(
    'INSERT INTO usuarios (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id',
    [username, passwordHash, email]
  );
  return result.rows[0].id;
};

// File queries
const getFile = async (fileId) => {
  const result = await pool.query(
    'SELECT file_id, filename, size, owner_username, checksum FROM archivos WHERE file_id = $1 AND deleted = false',
    [fileId]
  );
  return result.rows[0];
};

const listFiles = async (limit = 10) => {
  const result = await pool.query(
    'SELECT file_id, filename, size, owner_username, checksum FROM archivos WHERE deleted = false LIMIT $1',
    [limit]
  );
  return result.rows;
};

const deleteFile = async (fileId) => {
  await pool.query(
    'UPDATE archivos SET deleted = true WHERE file_id = $1',
    [fileId]
  );
};

// Audit queries
const insertAuditEvent = async (eventId, timestamp, usuario, accion, recurso, resultado) => {
  await pool.query(
    'INSERT INTO eventos_auditoria (event_id, timestamp, usuario, accion, recurso, resultado) VALUES ($1, $2, $3, $4, $5, $6)',
    [eventId, timestamp, usuario, accion, recurso, resultado]
  );
};

// Node queries
const registerNode = async (nodeId, address, port) => {
  await pool.query(
    'INSERT INTO nodos (node_id, address, port, activo) VALUES ($1, $2, $3, true) ON CONFLICT (node_id) DO UPDATE SET activo = true, updated_at = NOW()',
    [nodeId, address, port]
  );
};

const getNodes = async () => {
  const result = await pool.query('SELECT node_id, address, port, activo FROM nodos WHERE activo = true');
  return result.rows;
};

module.exports = {
  getUserByUsername,
  createUser,
  getFile,
  listFiles,
  deleteFile,
  insertAuditEvent,
  registerNode,
  getNodes,
};
