#!/bin/sh
set -e

echo "🔧 ZenBlock Container Starting..."

# Run database migrations using the copied prisma binary
echo "📦 Running database migrations..."
node ./node_modules/prisma/build/index.js migrate deploy

# Check if migration was successful
if [ $? -eq 0 ]; then
  echo "✅ Database migrations completed successfully"
else
  echo "❌ Database migration failed"
  exit 1
fi

# Start the application
echo "🚀 Starting Next.js application..."
exec node server.js
