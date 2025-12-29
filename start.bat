@echo off
chcp 65001 >nul
echo ============================================
echo    ZenBlock Defense System Starting...
echo ============================================
echo.

REM 1. Check and install dependencies
if not exist node_modules (
  echo [1/3] First run detected - Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] Dependency installation failed!
    pause
    exit /b 1
  )
  echo.
)

REM 2. Database sync
echo [2/3] Syncing database (Prisma Migrate)...
call npx prisma migrate deploy
if errorlevel 1 (
  echo [WARN] Migration failed, trying dev mode...
  call npx prisma migrate dev --name init
)
echo.

REM 3. Start development server
echo [3/3] Launching system...
echo ============================================
echo   Access URLs:
echo   - Local:     http://localhost:3000
echo   - Chinese:   http://localhost:3000/zh
echo   - English:   http://localhost:3000/en
echo ============================================
echo.
call npm run dev