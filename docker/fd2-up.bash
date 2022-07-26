#!/bin/bash
#docker rm $(docker ps -a -q -f name=fd2_) > /dev/null 2>&1

# Delete any of the existing containers (except dev)
echo "Starting FarmData2..."

echo "Removing any stale containers..."
docker rm fd2_mariadb &> /dev/null
docker rm fd2_phpmyadmin &> /dev/null
docker rm fd2_farmdata2 &> /dev/null

echo "Starting containers..."
# Note: Any command line args are passed to the docker-compose up command
# Useful for: --force-recreate in particular.
docker-compose up -d "$@"

sleep 3  # give site time to come up before clearing the cache.

echo "Clearing drupal cache..."
docker exec -it fd2_farmdata2 drush cc all

echo "Done."
