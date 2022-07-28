#!/bin/bash

# Install VS Code.
# There is no repo that will auto choose the architecture for us.
# So download the right deb file manually.

ARCH=$(uname -m)

if [ "$ARCH" = "aarch64" ]
then
  echo "Installing for arm64"
  wget -O vscode.deb "https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-arm64"
else
  echo "Installing for amd64"
  wget -O vscode.deb "https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64"
fi

apt install -y --no-install-recommends \
    ./vscode.deb

rm vscode.deb

# Patch the xfce menu item for VS Code so it runs correctly.
sed -i 's+usr/share/code/code+/usr/bin/code --no-sandbox+g' /usr/share/applications/code.desktop
