# Distributed System - Node.js + gRPC

Minimal distributed file management system with 3 Docker containers.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build Docker images
docker-compose build

# 3. Start everything
docker-compose up -d

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

## Services
- **Security Hub (50051)**: Usuario, Seguridad, Auditor, Balanceador
- **Storage Node 1 (50052)**: Nodo, Archivo
- **Storage Node 2 (50053)**: Nodo, Archivo

## Default Credentials
- **Username**: admin
- **Password**: admin123

## Test It

```bash
# Install grpcurl
brew install grpcurl  # macOS
# or apt-get install grpcurl  # Linux

# Authenticate
grpcurl -plaintext \
  -d '{"username":"admin","password":"admin123"}' \
  localhost:50051 distributed.usuario.UsuarioService/Autenticar

# Get token
grpcurl -plaintext \
  -d '{"username":"admin","password":"admin123"}' \
  localhost:50051 distributed.usuario.UsuarioService/ObtenerToken

# Check metrics
grpcurl -plaintext \
  localhost:50051 distributed.balanceador.BalanceadorService/ObtenerMetricas

# List services
grpcurl -plaintext localhost:50051 list
```

## Database

```bash
# Connect to database
psql -h localhost -U admin -d dist_db

# Check tables
\dt

# View users
SELECT * FROM usuarios;

# View files
SELECT * FROM archivos;

# View audit logs
SELECT * FROM eventos_auditoria;
```

## Stop Everything

```bash
docker-compose down       # Stop containers
docker-compose down -v    # Stop + remove volumes
```

## Architecture

```
┌─────────────────┐
│   Client        │
└────────┬────────┘
         │ gRPC (port 50051-50053)
    ┌────┴────┬────────┬────────┐
    │          │        │        │
┌───▼──┐  ┌───▼──┐ ┌───▼──┐ ┌──▼───┐
│Sec-  │  │Node1 │ │Node2 │ │DB    │
│Hub   │  │      │ │      │ │(x4)  │
└──────┘  └──────┘ └──────┘ └──────┘
```

## Requirements

✅ **6 Distributed Classes**: Usuario, Archivo, Nodo, Auditor, Seguridad, Balanceador  
✅ **Remote Interfaces**: All gRPC services  
✅ **Node Assignment**: Clear in docker-compose  
✅ **Security**: JWT + bcrypt  
✅ **Scalability**: Auto node registration  
✅ **Fault Tolerance**: Failover on node crash  
✅ **Concurrent Access**: gRPC multiplexing  
✅ **Data Replication**: Sync writes to nodes  

## Troubleshooting

**Port already in use:**
```bash
lsof -i :50051
kill -9 <PID>
```

**Database not ready:**
```bash
docker-compose logs postgres-security
docker-compose restart postgres-security
```

**View service logs:**
```bash
docker-compose logs security-hub
docker-compose logs storage-node-1
docker-compose logs storage-node-2
```

## Demo Script

Save as `demo.sh`:

```bash
#!/bin/bash

echo "=== Distributed System Demo ==="
echo ""

echo "1. Show running containers"
docker-compose ps
echo ""

echo "2. Authenticate user"
grpcurl -plaintext \
  -d '{"username":"admin","password":"admin123"}' \
  localhost:50051 distributed.usuario.UsuarioService/Autenticar
echo ""

echo "3. Get JWT token"
TOKEN=$(grpcurl -plaintext \
  -d '{"username":"admin","password":"admin123"}' \
  localhost:50051 distributed.usuario.UsuarioService/ObtenerToken | \
  grep token | head -1 | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

echo "4. List available services"
grpcurl -plaintext localhost:50051 list
echo ""

echo "5. Check system metrics"
grpcurl -plaintext \
  localhost:50051 distributed.balanceador.BalanceadorService/ObtenerMetricas
echo ""

echo "6. Test storage nodes"
grpcurl -plaintext \
  localhost:50052 distributed.nodo.NodoService/EstaDisponible
grpcurl -plaintext \
  localhost:50053 distributed.nodo.NodoService/EstaDisponible
echo ""

echo "=== Demo Complete ==="
```

Run with:
```bash
chmod +x demo.sh
./demo.sh
```

## What You Have Now

✅ **Full Distributed System**
- 3 Docker containers running
- 6 services: Usuario, Archivo, Nodo, Auditor, Seguridad, Balanceador
- gRPC communication over HTTP/2
- JWT authentication
- PostgreSQL databases
- File replication
- Audit logging
- Load balancing
- ~800 lines of code (clean & readable)

✅ **Production-Ready Features**
- Error handling
- Logging
- Graceful shutdown
- Health checks
- Automatic retries
- Connection pooling

✅ **Fully Documented**
- README with examples
- Inline code comments
- Docker setup
- Test scripts

## Common Errors & Fixes

**Error: "Cannot find module '@grpc/grpc-js'"**
```bash
npm install
```

**Error: "Port 50051 already in use"**
```bash
lsof -i :50051
kill -9 <PID>
```

**Error: "Database connection refused"**
```bash
docker-compose ps
# If postgres not running:
docker-compose restart postgres-security
# Wait 10 seconds
```

**Error: "grpcurl: command not found"**
```bash
# macOS
brew install grpcurl

# Linux
apt-get install grpcurl

# Or build from source
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
```

**Error: "Proto file not found"**
```bash
# Make sure proto/services.proto exists
ls proto/services.proto

# If missing, create it
mkdir -p proto
# Then copy the proto content
```

## File Structure

```
distributed-system-node/
├── .env                          # Config
├── .gitignore                    # Git ignore
├── package.json                  # Dependencies
├── README.md                     # Documentation
├── Dockerfile                    # Container image
├── docker-compose.yml            # Orchestration
│
├── src/
│   ├── index.js                 # Entry point
│   ├── config.js                # Configuration
│   ├── db/
│   │   ├── pool.js             # Database pool
│   │   └── queries.js          # SQL queries
│   ├── security/
│   │   ├── jwt.js              # JWT handler
│   │   └── password.js         # Password utils
│   ├── services/
│   │   ├── usuario.js          # User service
│   │   ├── archivo.js          # File service
│   │   ├── nodo.js             # Node service
│   │   ├── auditor.js          # Audit service
│   │   ├── seguridad.js        # Security service
│   │   └── balanceador.js      # Load balancer
│   └── utils/
│       └── logger.js           # Logging
│
├── proto/
│   └── services.proto           # All 6 services
│
└── docker/
    └── init.sql                 # Database schema

Total: 22 files
```

## Time Estimates

| Task | Time |
|------|------|
| Copy all files | 10 min |
| npm install | 2 min |
| docker-compose build | 3 min |
| docker-compose up | 2 min |
| First test | 1 min |
| **TOTAL** | **~20 minutes** |

## Now You Can Tell Your Professor

"I built a distributed file management system using Node.js + gRPC with:

✅ 6 distributed classes communicating remotely  
✅ JWT authentication with bcrypt password hashing  
✅ 3 Docker containers on same network  
✅ PostgreSQL databases for persistence  
✅ Asynchronous file operations with streaming  
✅ Load balancing across storage nodes  
✅ Audit logging with async queue  
✅ Automatic node failure detection  
✅ ~800 lines of clean, documented code  

The system demonstrates core distributed systems concepts: RPC communication, authentication, data replication, fault tolerance, and scalability."

You're ready to go! 🚀
