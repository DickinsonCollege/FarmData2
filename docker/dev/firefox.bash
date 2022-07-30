#!/bin/bash

# Install a deb version of firefox for arm64
# Note: Base Cypress container has browsers for amd64
# So this only necessary on arm64 processors (i.e. M1)
# Hopefully the base image for arm64 will include browsers soon.

ARCH=$(uname -m)

if [ "$ARCH" = "aarch64" ]
then
  echo "Installing for arm64"
  wget -O firefox.deb "http://ports.ubuntu.com/pool/main/f/firefox/firefox_88.0+build2-0ubuntu0.16.04.1_arm64.deb"

  apt install -y --no-install-recommends \
      ./firefox.deb

  rm firefox.deb
fi

# Ensure that the launcher icon for the browser starts firefox.
sed -i 's+debian-sensible-browser+firefox+g' /etc/xdg/xfce4/helpers.rc
