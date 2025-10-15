const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const config = require('./config');
const logger = require('./utils/logger');

const usuarioService = require('./services/usuario');
const archivoService = require('./services/archivo');
const nodoService = require('./services/nodo');
const auditorService = require('./services/auditor');
const seguridadService = require('./services/seguridad');
const balanceadorService = require('./services/balanceador');

const protoPath = path.join(__dirname, '../proto/services.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

const startServer = () => {
  const server = new grpc.Server();
  
  try {
    if (config.SERVICE_TYPE === 'SECURITY') {
      server.addService(proto.distributed.usuario.UsuarioService.service, usuarioService);
      server.addService(proto.distributed.seguridad.SeguridadService.service, seguridadService);
      server.addService(proto.distributed.auditor.AuditorService.service, auditorService);
      server.addService(proto.distributed.balanceador.BalanceadorService.service, balanceadorService);
      logger.info('Security Hub started');
    } else if (config.SERVICE_TYPE === 'STORAGE') {
      server.addService(proto.distributed.nodo.NodoService.service, nodoService);
      server.addService(proto.distributed.archivo.ArchivoService.service, archivoService);
      server.addService(proto.distributed.auditor.AuditorService.service, auditorService);
      logger.info('Storage Node started');
    }
    
    const address = `0.0.0.0:${config.SERVICE_PORT}`;
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err) {
        logger.error(`Bind error: ${err}`);
        process.exit(1);
      }
      
      server.start();
      logger.info(`✓ Listening on port ${config.SERVICE_PORT}`);
    });
    
  } catch (err) {
    logger.error(`Start error: ${err}`);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  logger.info('Shutting down...');
  process.exit(0);
});

startServer();
