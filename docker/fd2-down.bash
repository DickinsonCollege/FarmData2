#!/bin/bash
# Take all of the containers down

echo "Stopping Containers..."
docker stop fd2_phpmyadmin
docker stop fd2_farmdata2
docker stop fd2_mariadb
docker stop fd2_dev

echo "Deleting containers..."
docker rm fd2_mariadb
docker rm fd2_phpmyadmin --volumes  # remove /sessions volume created.
docker rm fd2_farmdata2

echo "Done."
