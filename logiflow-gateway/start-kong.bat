@echo off
echo.
echo ========================================
echo  Kong API Gateway - LogiFlow
echo ========================================
echo.

REM Verificar Docker
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo
    echo Por favor, inicia Docker Desktop y vuelve a intentar
    pause
    exit /b 1
)

echo [OK] Docker esta corriendo
echo.

REM Limpiar servicios anteriores
echo Limpiando servicios anteriores...
docker-compose down

echo.
echo Iniciando servicios...
echo.

REM Iniciar servicios
docker-compose up -d

echo.
echo Esperando a que Kong este listo...
echo.

REM Esperar a Kong
timeout /t 10 /nobreak >nul

REM Verificar Kong
curl -s http://localhost:8001/status >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Kong no respondio
    echo Revisa los logs con: docker-compose logs kong
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Kong API Gateway esta corriendo!
echo ========================================
echo.
echo URLs disponibles:
echo   - Gateway (Proxy):     http://localhost:8000
echo   - Kong Admin API:      http://localhost:8001
echo   - Kong Manager:        http://localhost:8002
echo   - Konga Dashboard:     http://localhost:1337
echo.
echo Comandos utiles:
echo   - Ver logs:       docker-compose logs -f kong
echo   - Detener Kong:   docker-compose down
echo   - Reiniciar:      docker-compose restart kong
echo.
echo ========================================
echo.

pause