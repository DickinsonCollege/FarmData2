#!/bin/bash

echo "Starting FarmData2..."

# Delete any of the existing containers (except dev)
echo "Removing any stale containers..."
docker rm fd2_mariadb &> /dev/null
docker rm fd2_phpmyadmin &> /dev/null
docker rm fd2_farmdata2 &> /dev/null

echo "Detecting Operating System..."
# Note: Profiles are defined in docker-compose.yml.
OS=$(uname)
PROFILE=windows
if [ "$OS" == "Darwin" ] || [ "$OS" == "Linux" ]
then
  PROFILE=unix
fi
echo "Runnin on "$PROFILE

echo "Starting containers..."
# Note: Any command line args are passed to the docker-compose up command
# Useful for: --force-recreate in particular.
docker compose --profile $PROFILE up -d "$@"

echo "Clearing drupal cache..."
sleep 3  # give site time to come up before clearing the cache.
docker exec -it fd2_farmdata2 drush cc all

echo "FarmData2 started."
