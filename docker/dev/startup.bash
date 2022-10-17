#!/bin/bash

# Cleanup from past vnc session that may hav been running in the container.
# This clean-up is not done when the container is stopped (not deleted).
rm /tmp/.X11-unix/X1
rm /tmp/.X1-lock

# Create the docker group and ensure that the docker.sock 
# has the appropriate permissions.
echo "fd2dev" | sudo -S groupdel docker 
echo "fd2dev" | sudo -S groupadd --gid $(cat /.fd2/docker.gid) docker
echo "fd2dev" | sudo -S usermod -a -G docker fd2dev
echo "fd2dev" | sudo -S chgrp docker /var/run/docker.sock
echo "fd2dev" | sudo -S chmod 775 /var/run/docker.sock

# Create the fd2grp group and ensure that the contents of the
# FarmData2 and fd2test files and directories all have the 
# correct permissions.
echo "fd2dev" | sudo -S groupdel fd2grp
echo "fd2dev" | sudo -S groupadd --gid $(cat /.fd2/fd2grp.gid) fd2grp
echo "fd2dev" | sudo -S usermod -a -G fd2grp fd2dev
echo "fd2dev" | sudo -S chgrp -R fd2grp /home/fd2dev/FarmData2
echo "fd2dev" | sudo -S chmod -R g+rw /home/fd2dev/FarmData2
echo "fd2dev" | sudo -S chgrp -R fd2grp /home/fd2dev/fd2test
echo "fd2dev" | sudo -S chmod -R g+rw /home/fd2dev/fd2test

# Launch the VNC server
vncserver \
  -localhost no \
  -geometry 1024x768 -depth 16 \
  -SecurityTypes None --I-KNOW-THIS-IS-INSECURE

# Launch the noVNC server.
/usr/share/novnc/utils/launch.sh --vnc localhost:5901 --listen 6901
