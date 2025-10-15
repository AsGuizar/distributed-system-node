const db = require('../db/queries');
const logger = require('../utils/logger');

const auditBuffer = [];

const persistEvents = async () => {
  setInterval(async () => {
    while (auditBuffer.length > 0) {
      const event = auditBuffer.shift();
      try {
        await db.insertAuditEvent(
          event.eventId,
          event.timestamp.seconds,
          event.usuario,
          event.accion,
          event.recurso,
          event.resultado
        );
      } catch (err) {
        logger.error(`Persist error: ${err.message}`);
        auditBuffer.unshift(event);
        break;
      }
    }
  }, 1000);
};

persistEvents();

const RegistrarEvento = async (call, callback) => {
  const { event } = call.request;
  
  try {
    auditBuffer.push(event);
    logger.debug(`Event queued: ${event.accion}`);
    callback(null, { success: true });
  } catch (err) {
    logger.error(`Queue error: ${err.message}`);
    callback(err);
  }
};

const ConsultarEventos = async (call, callback) => {
  callback(null, { eventos: [] });
};

module.exports = {
  RegistrarEvento,
  ConsultarEventos,
};
