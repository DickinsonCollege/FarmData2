#!/bin/bash

# Change the database that is being used by FarmData2.
# This script
#  - shuts down FarmData2 (if running)
#  - removes the current docker/db folder (if it exists)
#  - extracts the indicated compressed db.*.tar.bzip file
#  - restarts FarmData2 (if it was running)
#  - clears the drupal cache (if running)

HOST=$(docker inspect -f '{{.Name}}' $HOSTNAME 2> /dev/null)
if [ "$HOST" != "/fd2_dev" ];
then
  echo "Error: The setDB script must be run in the dev container."
  exit -1
fi

FILE="db.$1.tar.bz2"

if [ ! -e $FILE ]
then
  echo "Usage: setDB.bash <db>"
  echo "    <db>: The unique part of the database image filename to use."
  echo "            - empty - a db with no data."
  echo "               - used mostly as a base for building the sample db."
  echo "            - sample - the sample db for development."
  echo "               - see docker/sampleDB/README.md."
else

  echo "Switching to the "$FILE" database..."

  FD2_RUNNING=$(docker ps | grep fd2_farmdata2 | wc -l)
  if [ $FD2_RUNNING -eq 1 ]
  then
#    echo "  Stopping FarmData2..."
#    docker stop fd2_farmdata2
    echo "  Stopping mariadb..."
    docker stop fd2_mariadb
    echo "  Stopped."
  fi

  if [ -d "db" ]
  then
    echo "  Removing old database..."
    cd db
    sudo rm -rf *
    cd ..
    echo "  Removed."
  fi

  echo "  Extracting new database image..."
  cd db
  sudo tar -xjf ../$FILE
  cd ..
  echo "  Extracted."

  if [ $FD2_RUNNING -eq 1 ]
  then
    echo "  Restarting mariadb..."
    docker start fd2_mariadb
    echo "  Restarted."
    echo "  Clearing farmOS Drupal cache..."
    sleep 2
    docker exec -it fd2_farmdata2 drush cc all
    echo "  Cleared"
  fi

  echo "Switched to "$FILE" database."
fi
