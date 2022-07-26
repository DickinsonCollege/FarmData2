#!/bin/bash
# Take all of the containers down
#   The --volumes delete the volumecreted by the myPHPAdmin container.

echo "Stopping Containers..."
docker stop fd2_phpmyadmin
docker stop fd2_farmdata2
docker stop fd2_mariadb

echo "Deleting containers..."
docker rm fd2_mariadb
docker rm fd2_phpmyadmin --volumes
docker rm fd2_farmdata2

echo "Stopping dev container..."
docker compose stop
echo "Done."
