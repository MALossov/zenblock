@echo off
chcp 65001 >nul
echo ============================================
echo    ZenBlock Production Deployment
echo ============================================
echo.

REM 1. Check dependencies
if not exist node_modules (
  echo [1/4] Installing dependencies...
  call npm install --production
  if errorlevel 1 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
  )
  echo.
)

REM 2. Database setup
echo [2/4] Setting up database...
call npx prisma generate
call npx prisma migrate deploy
if errorlevel 1 (
  echo [WARN] Migration failed, trying dev mode...
  call npx prisma migrate dev --name init
)
echo.

REM 3. Build application
echo [3/4] Building application...
call npm run build
if errorlevel 1 (
  echo [ERROR] Build failed!
  pause
  exit /b 1
)
echo.

REM 4. Start production server
echo [4/4] Starting production server...
echo ============================================
echo   Production server will start on port 3000
echo   Access at: http://localhost:3000
echo ============================================
echo.
call npm run start
