#!/bin/bash

# Note: VS Codium is an open source licenced version of VS code
# that has all of the MS telemetry stripped out of it.
# Better for privacy and seems more stable running in docker than VS Code.

# Approach from:
# https://vscodium.com/#install

wget -qO - https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/raw/master/pub.gpg \
    | gpg --dearmor \
    | dd of=/usr/share/keyrings/vscodium-archive-keyring.gpg

echo 'deb [ signed-by=/usr/share/keyrings/vscodium-archive-keyring.gpg ] https://download.vscodium.com/debs vscodium main' \
    | tee /etc/apt/sources.list.d/vscodium.list

apt update
apt install -y codium

# Install some useful extensions
codium --install-extension streetsidesoftware.code-spell-checker


# Patch the xfce menu item for VS Codium so it runs correctly.
sed -i 's+/usr/share/codium/codium+/usr/bin/codium --no-sandbox+g' /usr/share/applications/codium.desktop
