#!/bin/bash

# Build and push to DockerHub multi architecture images
# for all of the containers used by FarmData2.

LOGGED_IN=$(cat ~/.docker/config.json 2> /dev/null | grep "index.docker.io" | wc -l | cut -f 8 -d ' ')
if [ "$LOGGED_IN" == "0" ];
then
  echo "Please log into Docker Hub before building images."
  echo "  Use: docker login"
  echo "This allows multi architecture images to be pushed."
  exit -1
fi

if [ $# -lt 1 ];
then
  echo "Please specify one or more images to build."
  echo "E.g. build-images.bash dev farmOS"
  echo "  Valid images to build are the directories in the docker folder"
  echo "  that contain a Dockerfile. (e.g. dev farmos mariaDB phpmyadmin)."
  exit -1
fi

# Create the builder if it doesn't exist.
FD2_BUILDER=$(docker buildx ls | grep "fd2builder" | wc -l | cut -f 8 -d ' ')
if [ "$FD2_BUILDER" == "0" ];
then
  echo "Making new builder for FarmData2 images."
  docker buildx create --name fd2builder
fi

# Switch to use the fd2builder.
echo "Using the fd2bilder."
docker buildx use fd2builder

# Build and push each of the images to Docker Hub.
for IMAGE in "$@"
do
  if [ ! -f $IMAGE/Dockerfile ] | [ ! -f $IMAGE/repo.txt ];
  then
    echo "Error: $IMAGE/Dockerfile or $IMAGE/repo.txt does not exit."
    echo "       Skipping $IMAGE"
  else
    echo "Building $IMAGE..."

    cd $IMAGE

    if [ -f before.bash ];
    then
      echo "  Running before.bash..."
      source ./before.bash
    fi

    TAG=$(cat repo.txt)
    REPO="farmdata2/$TAG"
    echo "  Performing docker build using tag $REPO ..."
    docker buildx build --platform linux/amd64,linux/arm64 -t $REPO --push .

    if [ -f after.bash ];
    then
      echo "  Running after.bash..."
      source ./after.bash
    fi 

    cd ..

    echo "Done building $IMAGE."
  fi
done
