#!/bin/bash

# Build and optionally push to DockerHub multi architecture images
# or single architecture local images for FarmData2.

LOCAL_BUILD=0

# Check for --local flag
if [ "$1" == "--local" ]; then
    LOCAL_BUILD=1
    shift # Remove the --local argument
fi

# Check for Docker Hub login only if not a local build
if [ "$LOCAL_BUILD" -eq 0 ]; then
    LOGGED_IN=$(cat ~/.docker/config.json 2> /dev/null | grep "index.docker.io" | wc -l | cut -f 8 -d ' ')
    if [ "$LOGGED_IN" == "0" ];
    then
      echo "Please log into Docker Hub before building images."
      echo "  Use: docker login"
      echo "This allows multi architecture images to be pushed."
      exit -1
    fi
fi

if [ $# -lt 1 ];
then
  echo "Please specify one or more images to build."
  echo "E.g. build-images.bash dev farmOS"
  echo "  Valid images to build are the directories in the docker folder"
  echo "  that contain a Dockerfile. (e.g. dev farmos mariaDB phpmyadmin)."
  exit -1
fi

# Create the builder if it doesn't exist and if not a local build
if [ "$LOCAL_BUILD" -eq 0 ]; then
    FD2_BUILDER=$(docker buildx ls | grep "fd2builder" | wc -l | cut -f 8 -d ' ')
    if [ "$FD2_BUILDER" == "0" ];
    then
      echo "Making new builder for FarmData2 images."
      docker buildx create --name fd2builder
    fi

    # Switch to use the fd2builder.
    echo "Using the fd2builder."
    docker buildx use fd2builder
fi

# Build (and push) each of the images
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

    if [ "$LOCAL_BUILD" -eq 1 ]; then
        # Local build for the architecture of the local machine
        docker build -t $REPO .
    else
        # Multi architecture build and push
        docker buildx build --platform linux/amd64,linux/arm64 -t $REPO --push .
    fi

    if [ -f after.bash ];
    then
      echo "  Running after.bash..."
      source ./after.bash
    fi 

    cd ..

    echo "Done building $IMAGE."
  fi
done
