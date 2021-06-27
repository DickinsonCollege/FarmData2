#!/bin/bash

# Change the database that is being used by FarmData2.
# This script
#  - shuts down FarmData2
#  - removes the current docker/db folder
#  - extracts the indicated compressed db.*.tar.bzip file
#  - restarts FarmData2
#  - clears the drupal cache

FILE="db.$1.tar.bz2"
echo $FILE

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
  ./fd2-down.bash
  sudo rm -rf db
  tar -xjf $FILE
  ./fd2-up.bash
  echo "Switched to "$FILE" database."
fi