#!/bin/bash

if [ ! -f ./auth_linux ]; then
  echo "Checking version..."
  VERSION=$(curl -s "https://api.github.com/repos/openhotel/auth/releases/latest" | jq -r '.tag_name')

  echo "Downloading server (version $VERSION)..."
  curl -L https://github.com/openhotel/auth/releases/download/$VERSION/auth_linux > auth_linux

  echo "Server downloaded!"

  chmod 777 auth_linux
fi

./auth_linux