#!/bin/sh
set -e

MAIN="dist/${APP_PATH}/src/main.js"

echo "🚀 Starting app: $MAIN"

exec node "$MAIN"
