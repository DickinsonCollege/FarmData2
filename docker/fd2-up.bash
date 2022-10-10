#!/bin/bash

echo "Starting FarmData2..."

echo "Detecting Operating System..."
# Note: Profiles are defined in docker-compose.yml.
OS=$(uname)
PROFILE=
if [ "$OS" == "Darwin" ]
then
  PROFILE=unix
elif [ "$OS" == "Linux" ]
then
  PROFILE=unix
  
  # Linux uses the host UID/GID values from mounted directories in the container.
  # So we need to ensure that the fd2user user in the container can RW the FarmData2 direcotry.
  # We do so by creating a group (fd2grp, GID=23432) on the host and in the container.
  # Note that, if on the host a group with GID=23432 already exists we bail :(.
  # Otherwise we create the group on the host. We then give that group RW access to 
  # everything in the FarmData2 directory. The user (fd2dev) in the container is also 
  # in the group (fd2grp, GID=23432) so then it may RW all of the mounted FarmData2 direcotry.
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
  echo "Your user "$(whoamni)" will be added to the group fd2grp."
  echo "The FarmData2 directory will be added to the group fd2grp."
  echo "This allows the FarmData2 direcotry to be RW within the development environment."
  echo "Enter your sudo password to continue or CTRL-C to quit."

  sudo groupadd -g 23432 fd2grp
  sudo usermod -a -G 23432 $(whoami)
  sudo chgrp -R fd2grp ~/FarmData2
  sudo chmod -R g+rw ~/FarmData2
else
  PROFILE=windows
fi
echo "Running on "$PROFILE

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
