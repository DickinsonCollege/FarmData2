#!/bin/bash
# Take all of the containers down

# Ensure that this script is not being run in the development container.
HOST=$(docker inspect -f '{{.Name}}' $HOSTNAME 2> /dev/null)
if [ "$HOST" == "/fd2_dev" ];
then
  echo "The fd2-down.bash script should not be run in the dev container."
  echo "Always run fd2-down.bash on your host OS."
  exit -1
fi

# Env var was not being set on MacOS
# So Revert this to the old approach.

# if [ -z "$COMPOSE_PROFILES" ]; then
#     echo "Error: COMPOSE_PROFILES doesn't have profiles stored. Please run fd2-up.bash to bring FarmData2 containers up first."
#     exit 1
# fi
# I'm pretty sure since the COMPOSE_PROFILES utilize the environment variables, you can just run docker-compose down and that's it.
#docker-compose down

echo "Stopping Containers..."
docker stop fd2_phpmyadmin
docker stop fd2_farmdata2
docker stop fd2_mariadb
docker stop fd2_dev
docker stop fd2_api

echo "Deleting containers..."
docker rm fd2_mariadb
docker rm fd2_phpmyadmin --volumes  # remove /sessions volume created.
docker rm fd2_farmdata2
docker rm fd2_dev
docker rm fd2_api

#Unsets COMPOSE_PROFILES to prevent irregular edge cases. 
unset COMPOSE_PROFILES
