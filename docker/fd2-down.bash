#!/bin/bash
# Take all of the containers down
#   The --volumes delete the volumecreted by the myPHPAdmin container.

echo "Stopping FarmData2..."
docker-compose stop

echo "Deleting containers..."
docker rm fd2_mariadb
docker rm fd2_phpmyadmin --volumes
docker rm fd2_farmdata2

echo "Done."
