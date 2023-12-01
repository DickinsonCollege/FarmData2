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

if [ -z "$COMPOSE_PROFILES" ]; then
    echo "Error: COMPOSE_PROFILES doesn't have profiles stored. Please run fd2-up.bash to bring FarmData2 containers up first."
    exit 1
fi

# I'm pretty sure since the COMPOSE_PROFILES utilize the environment variables, you can just run docker-compose down and that's it.
docker-compose down

#Unsets COMPOSE_PROFILES to prevent irregular edge cases. 
unset COMPOSE_PROFILES
