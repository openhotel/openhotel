#!/bin/bash

if [ ! -f ./server_linux ]; then
  echo "Checking version..."
  VERSION=$(curl -s "https://api.github.com/repos/openhotel/openhotel/releases/latest" | jq -r '.name')

  echo "Downloading server (version $VERSION)..."
  curl -L https://github.com/openhotel/openhotel/releases/download/$VERSION/server_linux.zip > server.zip

  echo "Server downloaded!"

  echo "Decompressing server..."
  unzip -o server.zip
  echo "Server decompressed!"

  chmod 777 server_linux
fi

./server_linux