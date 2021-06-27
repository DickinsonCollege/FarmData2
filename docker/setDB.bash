#!/bin/bash

# Change the database that is being used by FarmData2.
# This script
#  - shuts down FarmData2 (if running)
#  - removes the current docker/db folder (if it exists)
#  - extracts the indicated compressed db.*.tar.bzip file
#  - restarts FarmData2 (if it was running)
#  - clears the drupal cache (if running)

FILE="db.$1.tar.bz2"

if [ ! -e $FILE ]
then
  echo "Usage: setDB.bash <db>"
  echo "    <db>: The uniuque part of the database image filename to use."
  echo "            - empty - a db with no data"
  echo "            - sample - the sample db for development"
  echo "               - see docker/sampleDB/README.md "
  echo "            - orig - the original development db"
  echo "               - depricated and will go away."
else

  echo "Switching to the "$FILE" database..."

  FD2_RUNNING=$(docker ps | grep fd2_farmdata2 | wc -l)
  if [ $FD2_RUNNING -eq 1 ]
  then
    echo "  Stopping FarmData2..."
    ./fd2-down.bash
    echo "  Stopped."
  fi

  if [ -d "db" ]
  then
    echo "  Removing old database..."
    sudo rm -rf db
    echo "  Removed."
  fi

  echo "  Extracting new database image..." 
  tar -xjf $FILE
  echo "  Extracted."

  if [ $FD2_RUNNING -eq 1 ]
  then
    echo "  Restarting FarmData2..."
    ./fd2-up.bash
    echo "  Restarted."
  fi

  echo "Switched to "$FILE" database."
fi