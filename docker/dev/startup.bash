#!/bin/bash

# Cleanup from past VNC session that may have been running in the container.
# This clean-up is not done when the container is stopped (not deleted).
# Using `rm -f` to ignore nonexistent files and suppress error messages.
rm -f /tmp/.X11-unix/X1
rm -f /tmp/.X1-lock

# The sudo password is assumed to be 'fd2dev' for all operations.
# Using a single invocation of sudo and a here-document to execute multiple commands.
# This reduces the number of times the password needs to be echoed and sudo is called.
# This also reduces the script complexity and potential points of failure.
sudo -S sh <<SCRIPT
# Ensure that the fd2dev user is in a group that has RW permission to the docker.sock file.
HOST_DOCKER_GID=\$(cat ~/.fd2/gids/docker.gid)
if ! grep -q ":$HOST_DOCKER_GID:" /etc/group; then
  groupadd --gid $HOST_DOCKER_GID fd2docker
fi
usermod -a -G $HOST_DOCKER_GID fd2dev
chgrp $HOST_DOCKER_GID /var/run/docker.sock
chmod 775 /var/run/docker.sock

# Ensure that the fd2grp has RW access to mounted FarmData2 directory.
# This may not be necessary on Linux as the group will reflect the host group.
# But it does make things consistent across macOS and Linux.
chgrp -R fd2grp /home/fd2dev/FarmData2
chmod -R g+rw /home/fd2dev/FarmData2

# Ensure that the dbus service is running.
/etc/init.d/dbus restart
SCRIPT

# Launch the VNC server with the desired settings.
vncserver \
  -localhost no \
  -geometry 1024x768 -depth 16 \
  -SecurityTypes None --I-KNOW-THIS-IS-INSECURE

# Launch the noVNC server.
/usr/share/novnc/utils/launch.sh --vnc localhost:5901 --listen 6901
