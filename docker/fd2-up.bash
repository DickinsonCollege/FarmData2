#!/bin/bash

export HOST_UID=$(id -u)
export HOST_GID=$(id -g)
export HOST_USER=$(id -nu)
export HOST_GROUP=$(id -ng)

docker rm $(docker ps -a -q -f name=fd2_) > /dev/null 2>&1

docker-compose up -d

docker exec -it fd2_farmdata2 drush cc all