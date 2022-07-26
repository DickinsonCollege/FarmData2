#!/bin/bash
docker rm $(docker ps -a -q -f name=fd2_) > /dev/null 2>&1

docker-compose up -d

sleep 3  # give site time to come up before clearing the cache.

docker exec -it fd2_farmdata2 drush cc all
