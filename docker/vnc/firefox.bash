#!/bin/bash

# Install a deb version of firefox.
# The default is now to use snap.
# But snap does not run in docker.

# This approach from:
# https://www.omgubuntu.co.uk/2022/04/how-to-install-firefox-deb-apt-ubuntu-22-04

add-apt-repository ppa:mozillateam/ppa

echo '
Package:  *
Pin: release o=LP-PPA-mozillateam
Pin-Priority: -10

Package: *firefox*
Pin: release o=LP-PPA-mozillateam
Pin-Priority: 1001
' > /etc/apt/preferences.d/mozilla-firefox

apt install -y --no-install-recommends \
    firefox=103.0+build1-0ubuntu0.22.04.1~mt1
