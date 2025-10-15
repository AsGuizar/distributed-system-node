@echo off
echo === Distributed System Demo ===
echo.

echo 1. Show running containers
docker-compose ps
echo.

echo 2. Authenticate user
grpcurl -plaintext -d "{\"username\":\"admin\",\"password\":\"admin123\"}" localhost:50051 distributed.usuario.UsuarioService/Autenticar
echo.

echo 3. Get JWT token
grpcurl -plaintext -d "{\"username\":\"admin\",\"password\":\"admin123\"}" localhost:50051 distributed.usuario.UsuarioService/ObtenerToken
echo.

echo 4. List available services
grpcurl -plaintext localhost:50051 list
echo.

echo 5. Check system metrics
grpcurl -plaintext localhost:50051 distributed.balanceador.BalanceadorService/ObtenerMetricas
echo.

echo 6. Test storage nodes
grpcurl -plaintext localhost:50052 distributed.nodo.NodoService/EstaDisponible
grpcurl -plaintext localhost:50053 distributed.nodo.NodoService/EstaDisponible
echo.

echo === Demo Complete ===
pause
