#!/bin/bash

# This little script changes the default UMASK for the system
# in the container so that new files and directories created
# by the fd2dev user will also have RW permission for the
# group, which will be fd2grp.

UMASKLINE=$(grep -n "^UMASK.*022$" /etc/login.defs | cut -d: -f1)
sed -i "$UMASK_LINE s/022/002/" /etc/login.defs