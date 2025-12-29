#!/bin/bash
echo "============================================"
echo "   ZenBlock Production Deployment"
echo "============================================"
echo ""

# 1. Check dependencies
if [ ! -d "node_modules" ]; then
  echo "[1/4] Installing dependencies..."
  npm install --production
  if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies!"
    exit 1
  fi
  echo ""
fi

# 2. Database setup
echo "[2/4] Setting up database..."
npx prisma generate
npx prisma migrate deploy
if [ $? -ne 0 ]; then
  echo "[WARN] Migration failed, trying dev mode..."
  npx prisma migrate dev --name init
fi
echo ""

# 3. Build application
echo "[3/4] Building application..."
npm run build
if [ $? -ne 0 ]; then
  echo "[ERROR] Build failed!"
  exit 1
fi
echo ""

# 4. Start production server
echo "[4/4] Starting production server..."
echo "============================================"
echo "   Production server will start on port 3000"
echo "   Access at: http://localhost:3000"
echo "============================================"
echo ""
npm run start
