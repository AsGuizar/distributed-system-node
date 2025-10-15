@echo off
echo === Distributed System Setup ===
echo.

echo 1. Installing dependencies...
npm install
echo.

echo 2. Building Docker images...
docker-compose build
echo.

echo 3. Starting all services...
docker-compose up -d
echo.

echo 4. Waiting for services to start...
timeout /t 10 /nobreak
echo.

echo 5. Checking service status...
docker-compose ps
echo.

echo 6. Viewing logs (press Ctrl+C to stop)...
docker-compose logs -f
