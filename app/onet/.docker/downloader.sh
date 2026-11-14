#!/bin/bash

FILE_NAME='onet_linux'

# Detect architecture
ARCH=$(arch)
echo "arch: ($ARCH)"

if [ "$ARCH" = "aarch64" ]; then
  FILE_NAME="${FILE_NAME}_${ARCH}"
fi

if [ ! -f ./$FILE_NAME ]; then
  echo "Checking version..."
  VERSION=$(curl -s "https://api.github.com/repos/openhotel/onet/releases/latest" | jq -r '.tag_name')

  echo "Downloading server (version $VERSION)..."
  curl -L https://github.com/openhotel/onet/releases/download/$VERSION/$FILE_NAME.zip -o $FILE_NAME.zip

  echo "Server downloaded!"

  echo "Decompressing server..."
  unzip -o $FILE_NAME.zip
  echo "Server decompressed!"

  chmod 777 $FILE_NAME
fi

./$FILE_NAME
