const db = require('../db/queries');
const logger = require('../utils/logger');

const nodeRegistry = new Map();

setInterval(async () => {
  const now = Date.now();
  for (const [nodeId, node] of nodeRegistry) {
    if (now - node.lastHeartbeat > 90000) {
      logger.warn(`Node down: ${nodeId}`);
      node.disponible = false;
    }
  }
}, 30000);

const ObtenerNodoDisponible = async (call, callback) => {
  try {
    const available = Array.from(nodeRegistry.values()).filter(n => n.disponible);
    
    if (available.length === 0) {
      return callback(new Error('No nodes available'));
    }
    
    const bestNode = available.reduce((prev, current) => {
      return prev.espacioUsado < current.espacioUsado ? prev : current;
    });
    
    callback(null, {
      nodeId: bestNode.nodeId,
      address: bestNode.address,
      port: bestNode.port,
    });
  } catch (err) {
    logger.error(`Node error: ${err.message}`);
    callback(err);
  }
};

const RegistrarNodo = async (call, callback) => {
  const { nodeId, address, port } = call.request;
  
  try {
    nodeRegistry.set(nodeId, {
      nodeId,
      address,
      port,
      disponible: true,
      lastHeartbeat: Date.now(),
      espacioUsado: 0,
    });
    
    await db.registerNode(nodeId, address, port);
    
    logger.info(`Node registered: ${nodeId}`);
    callback(null, { success: true, message: 'Registered' });
  } catch (err) {
    logger.error(`Register error: ${err.message}`);
    callback(err);
  }
};

const ObtenerMetricas = async (call, callback) => {
  try {
    const nodes = Array.from(nodeRegistry.values());
    const activeNodes = nodes.filter(n => n.disponible).length;
    
    callback(null, {
      nodosActivos: activeNodes,
      archivosTotal: 0,
      espacioUsado: 0,
      nodos: nodes,
    });
  } catch (err) {
    logger.error(`Metrics error: ${err.message}`);
    callback(err);
  }
};

module.exports = {
  ObtenerNodoDisponible,
  RegistrarNodo,
  ObtenerMetricas,
};
