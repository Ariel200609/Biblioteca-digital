@echo off
REM Script para iniciar Biblioteca Digital con Docker Compose en Windows

echo.
echo ========================================
echo   BIBLIOTECA DIGITAL - Docker Startup
echo ========================================
echo.

REM Verificar si Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no está instalado o no está en el PATH
    echo Descarga Docker Desktop en: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Crear .env si no existe
if not exist .env (
    echo [INFO] Creando archivo .env...
    copy .env.example .env >nul
    echo [OK] Archivo .env creado
)

REM Detener contenedores anteriores si existen
echo.
echo [INFO] Deteniendo contenedores anteriores...
docker-compose down 2>nul

REM Levantar los contenedores
echo.
echo [INFO] Levantando contenedores Docker...
docker-compose up -d --build

REM Esperar a que todo esté listo
echo.
echo [INFO] Esperando a que los servicios se inicien...
timeout /t 10 /nobreak

REM Verificar estado
echo.
echo [INFO] Verificando estado de los servicios...
docker-compose ps

REM Mostrar información de acceso
echo.
echo ========================================
echo   SERVICIOS DISPONIBLES
echo ========================================
echo.
echo [Frontend]  http://localhost:5173
echo [Backend]   http://localhost:3000
echo [MySQL]     localhost:3307
echo             Usuario: biblioteca
echo             Contraseña: biblioteca123
echo.
echo [INFO] Para ver logs: docker-compose logs -f
echo [INFO] Para detener: docker-compose down
echo.
echo ========================================
pause
