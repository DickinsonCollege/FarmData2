#!/bin/bash

# Approach from:
#  https://github.com/accetto/ubuntu-vnc-xfce-g3/blob/master/docker/xfce-firefox/README.md

# Install VS Code.
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg && \
install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/ && \
sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list' && \
rm -f packages.microsoft.gpg && \
apt-get update && \
apt-get -y install --no-install-recommends \
    code && \
apt-get -y --purge remove wget apt-transport-https && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

# Patch the xfce menu item for VS Code so it runs correctly.
sed -i 's+usr/share/code/code+/usr/bin/code --no-sandbox+g' /usr/share/applications/code.desktop
