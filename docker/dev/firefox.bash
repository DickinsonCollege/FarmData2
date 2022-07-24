#!/bin/bash

# Install a deb version of firefox.

# The standard install now uses snap, which doesn't work in docker.
# So download the deb file manually.

ARCH=$(uname -m)

if [ "$ARCH" = "aarch64" ]
then
  echo "Installing for arm64"
  wget -O firefox.deb "http://ports.ubuntu.com/pool/main/f/firefox/firefox_102.0+build2-0ubuntu0.20.04.1_arm64.deb"

else
  echo "Installing for amd64"
  wget -O firefox.deb "http://archive.ubuntu.com/ubuntu/pool/main/f/firefox/firefox_102.0+build2-0ubuntu0.20.04.1_amd64.deb"
fi

apt install -y --no-install-recommends \
    ./firefox.deb

rm firefox.deb
