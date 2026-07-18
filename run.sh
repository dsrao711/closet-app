#!/usr/bin/env bash
# Starts the closet-app dev server in Expo Go mode.
#
# Note: --go is required because this project also has expo-dev-client
# installed, which makes `expo start` default to custom dev-client mode.
# The App Store version of Expo Go currently only supports up to SDK 54,
# which is what this project is pinned to, so --go keeps it compatible.
set -e
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

npx expo start --go
