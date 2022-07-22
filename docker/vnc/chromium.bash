#!/bin/bash

# Install a deb version of chromium.
# The default is now to use snap.
# But snap does not run in docker.

# This approach from:
# https://ubuntuhandbook.org/index.php/2022/05/install-chromium-deb-ubuntu-2204/

# https://launchpad.net/~savoury1/+archive/ubuntu/chromium
# https://ubuntuhandbook.org/index.php/2022/05/install-chromium-deb-ubuntu-2204/

add-apt-repository ppa:savoury1/ffmpeg4
add-apt-repository ppa:savoury1/chromium

echo '
Package: *
Pin: release o=LP-PPA-savoury1
Pin-Priority: -10

Package: *chromium*
Pin: release o=LP-PPA-savoury1
Pin-Priority: 1001
' > /etc/apt/preferences.d/chromium-browser

apt install -y chromium-browser
