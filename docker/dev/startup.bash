#!/bin/bash

# Cleanup from past vnc session that may hav been running in the container.
# This clean-up is not done when the container is stopped (not deleted).
rm /tmp/.X11-unix/X1
rm /tmp/.X1-lock

# Ensure that the fd2dev user is in a group that has RW permission to
# the docker.sock file.  This will allow fd2dev to use the docker on docker
# to interact with containers within the development environment.
# Note: This must be here instead of in Dockerfile so the GID for the
# docker.sock in the container can match the one on the host.
# Note: The docker.gid file is mounted into the container by docker-compose.
HOST_DOCKER_GID=$(cat ~/.fd2/gids/docker.gid)
HOST_DOCKER_GID_IN_CONTAINER=$(echo /etc/group | grep ":$HOST_DOCKER_GID:")
if [ -z "$HOST_DOCKER_GID_IN_CONTAINER" ];
then
  echo "fd2dev" | sudo -S groupadd --gid $HOST_DOCKER_GID fd2docker
fi
echo "fd2dev" | sudo -S usermod -a -G $HOST_DOCKER_GID fd2dev
echo "fd2dev" | sudo -S chgrp +$HOST_DOCKER_GID /var/run/docker.sock
echo "fd2dev" | sudo -S chmod 775 /var/run/docker.sock

# Ensure that the fd2grp has RW access to mounted FarmData2 directory.
# This probably is not necessary as in linux the group will reflect
# the host group.  But it does make things consistent across macOS and linux.
echo "fd2dev" | sudo -S chgrp -R fd2grp /home/fd2dev/FarmData2
echo "fd2dev" | sudo -S chmod -R g+rw /home/fd2dev/FarmData2

# Launch the VNC server
vncserver \
  -localhost no \
  -geometry 1024x768 -depth 16 \
  -SecurityTypes None --I-KNOW-THIS-IS-INSECURE

# Launch the noVNC server.
/usr/share/novnc/utils/launch.sh --vnc localhost:5901 --listen 6901
