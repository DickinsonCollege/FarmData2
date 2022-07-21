#!/bin/bash

# Launch the VNC server
vncserver -localhost no

# Launch the noVNC server.
/usr/share/novnc/utils/launch.sh --vnc localhost:5901 --listen 6901
