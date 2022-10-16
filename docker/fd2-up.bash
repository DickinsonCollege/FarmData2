#!/bin/bash

echo "Starting FarmData2..."

# Get the name of the directory containing the FarmData2 repo.
# This is the FarmData2 directory by default, but may have been
# changed by the user.
cd ..
DOCKER_DIR=$(pwd)
FD2_DIR=$(basename $DOCKER_DIR)
cd docker
echo "  Starting from $DOCKER_DIR in repo $FD2_DIR."

# Determine the host operating system.  This allows us to do different
# things based on the host, both in this script and in the startup.bash
# script that runs in the dev container when it starts.
echo "Detecting Operating System..."
OS=$(uname -a)
PROFILE=
if [[ "$OS" == *"Darwin"* ]];
then
  PROFILE=macos
elif [[ "$OS" == *"microsoft"* ]] || [[ "$OS" == *"Microsoft"* ]];
then
  # Note that this is before Linux because if running in WSL
  # uname -a reports Linux, but also has microsoft later in the output.
  PROFILE=windows
elif [[ "$OS" == *"Linux"* ]];
then
  PROFILE=linux
else
  echo "Your host operating system $OS was not recognized."
  echo "Plese file an issue on the FarmData2 issue tracker."
  exit -1 
fi
echo "  Running on a "$PROFILE" host."

exit -1

# Make sure that things are in order so that the user in the 
# development container will be able to access the docker.sock
# file and all of the FarmData2 files.
#
# This is done by making sure that for Windows/Linux hosts: 
#   * There is a docker group.
#   * The current user is in the docker group. 
#   * The docker.sock file is in the docker group.
#   * The docker group has RW access to docker.sock
#

# default value for MacOS
DOCKER_GID=23432
FD2_GID=23433

if [ "$PROFILE" == "windows" ] || [ "$PROFILE" == "linux" ];

  # If the docker group doesn't exist, create it.
  DOCKER_GRP_EXISTS=$(grep "docker" /etc/group)
  if ! $DOCKER_GRP_EXISTS ;
  then
  fi

  # If the current user is not in the docker group add them.
  IN_DOCKER_GRP=$(groups | grep "docker")
  if ! $IN_DOCKER_GRP ;
  then 
  fi

  # If the /var/run/docker.sock is not in the docker group add it.
  SOCK_IN_DOCKER=$(ls -l /var/run/docker.sock | grep " docker ")
  if ! $SOCK_IN_DOCKER ;
  then
  fi

  # If the docker group does not have write permission to docker.sock add it.
  DOCKER_RW_SOCK=$(ls -l /var/run/docker.sock | cut -c 5-6 | grep "rw")
  if ! $DOCKER_RW_SOCK ;
  then
  fi
fi 

# If group fd2grp does not exist on host create it
FD2GRP_EXISTS=$(grep "fd2grp" /etc/group)
if ! "$FD2GRP_EXISTS" ;
then
fi

# If the current user is not in the fd2grp then add them.
IN_FD2GRP=$(groups | grep "fd2grp")
if ! "$IN_FD2GRP" ;
then
fi

# If the FarmData2 directory is not in the gd2grp then set it.
FD2GRP_OWNS_FD2=$(ls -ld ../../$FD2_DIR | grep " fd2grp ")
if ! $FD2GRP_OWNS_FD2 ;
then
fi

# Put GID's of docker and fd2grp groups into files in ~/.fd2 on host
# These will be used by the startup.bash script in the dev container
# to ensure that the fd2dev user in the container has permissions to
# RW the FarmData2 files and /var/run/docker.sock.

exit -1



if [ "$PROFILE" == "windows" ] 

  # Linux uses the host UID/GID values from mounted directories in the container.
  # So we need to ensure that the fd2user user in the container can RW the FarmData2 direcotry.
  # We do so by creating a group (fd2grp, GID=23432) on the host and in the container.
  # Note that, if on the host a group with GID=23432 already exists we bail :(.
  # Otherwise we create the group on the host. We then give that group RW access to 
  # everything in the FarmData2 directory. The user (fd2dev) in the container is also 
  # in the group (fd2grp, GID=23432) so then it may RW all of the mounted FarmData2 direcotry.
  IN_FD2_GRP=$(groups | grep "fd2grp" | wc -l)
  if [ "$IN_FD2_GRP" == "0" ]
  then
    # Current user is no in the fd2grp so we need to do all of this...
    # otherwise it has all already been done.
    GRP_EXISTS=$(grep ":23432:" /etc/group)
    if [ "$GRP_EXISTS" != "" ]
    then
      echo "Your Linux host has an existing group with GID 23432."
      echo "FarmData2 is trying to use this GID."
      echo "This is an unlikekly situation that we have not yet dealt with."
      echo "If you encountere this message, please contact us."
      echo "We will work to resolve it."
      exit -1
    fi

    echo "FarmDat2 needs to create a new group fd2grp on your machine."
    echo "Your user "$(whoami)" will be added to the group fd2grp."
    echo "The FarmData2 directory will be added to the group fd2grp."
    echo "This allows the FarmData2 direcotry to be RW within the development environment."
    echo ""
    echo "Continue [Y/n]?"
    read CONT 

    if [ "$CONT" != "Y" ]
    then 
      echo "Canceled."
      exit -1
    fi

    sudo groupadd -g 23432 fd2grp
    sudo usermod -a -G 23432 $(whoami)
    sudo chgrp -R fd2grp ~/FarmData2
    sudo chmod -R g+rw ~/FarmData2
    newgrp fd2grp

    PROFILE=unix
  fi
fi



# Delete any of the existing containers (except dev)
echo "Removing any stale containers..."
docker rm fd2_mariadb &> /dev/null
docker rm fd2_phpmyadmin &> /dev/null
docker rm fd2_farmdata2 &> /dev/null

echo "Starting containers..."
# Note: Any command line args are passed to the docker-compose up command
# Useful for: --force-recreate in particular.
docker compose --profile $PROFILE up -d "$@"

echo "Clearing drupal cache..."
sleep 3  # give site time to come up before clearing the cache.
docker exec -it fd2_farmdata2 drush cc all

echo "FarmData2 started."
