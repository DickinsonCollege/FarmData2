#!/bin/bash

# This little script changes the default UMASK for the system
# in the container so that new files and directories created
# by the fd2dev user will also have RW permission for the
# group, which will be fd2grp.

# NOTE: There is an issue with macos and docker that prevents
# the umask from being applied to files that are created in 
# mounted volumes. So they are created in the container with group
# R only. But the fd2dev user owns them so can RW.  When the container
# is stopped and restarted the starup.bash script will change the 
# group permission to RW.

echo "" >> /etc/pam.d/common-session
echo "session optional pam_umask.so usergroups" >> /etc/pam.d/common-session

UMASKLINE=$(grep -n "^UMASK.*022$" /etc/login.defs | cut -d: -f1)
sed -i "$UMASK_LINE s/022/002/" /etc/login.defs

# This part changes the umask used by apps launched from the xfce4 desktop.
# As per: https://forums.debian.net/viewtopic.php?p=706423
sed -i '2 i umask 002' /etc/xdg/xfce4/xinitrc