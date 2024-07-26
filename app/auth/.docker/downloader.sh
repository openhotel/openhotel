#!/bin/bash

FILE_NAME='auth_linux'

# Detect architecture
ARCH=$(arch)
echo "arch: ($ARCH)"

if [ "$ARCH" = "aarch64" ]; then
  FILE_NAME="${FILE_NAME}_${ARCH}"
fi

if [ ! -f ./$FILE_NAME ]; then
  echo "Checking version..."
  VERSION=$(curl -s "https://api.github.com/repos/openhotel/auth/releases/latest" | jq -r '.tag_name')

  echo "Downloading server (version $VERSION)..."
  curl -L https://github.com/openhotel/auth/releases/download/$VERSION/$FILE_NAME > $FILE_NAME

  echo "Server downloaded!"

  chmod 777 $FILE_NAME
fi

./$FILE_NAME
