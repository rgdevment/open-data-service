#!/bin/sh
set -e

echo "🚀 Starting app at: dist/$APP_PATH/src/main.js"
exec node "dist/$APP_PATH/src/main.js"
