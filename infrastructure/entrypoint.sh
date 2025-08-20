#!/bin/sh
set -e

MAIN="dist/main.js"

echo "🚀 Starting app: $MAIN"

exec node "$MAIN"
