#!/bin/bash

# Prevent misc dbind warnings.
export NO_AT_BRIDGE=1

# MAY BE HELPFUL FOR chromium
# "fake" dbus address to prevent errors
# https://github.com/SeleniumHQ/docker-selenium/issues/87
export DBUS_SESSION_BUS_ADDRESS=/dev/null

# Launch the VNC server
vncserver -localhost no -geometry 1440x900

# Launch the noVNC server.
/usr/share/novnc/utils/launch.sh --vnc localhost:5901 --listen 6901
