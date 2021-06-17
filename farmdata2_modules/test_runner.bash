#!/bin/bash

xhost + > /dev/null

# If Dockerfile in docker/cypress is changed update
# the version number here to the next increment so that 
# it will rebuild for anyone using it.
FD_VER=fd2.3

if [ $# -ne 1 ] || [ "$1" != "e2e" -a "$1" != "ct" ]
then
  echo "Usage: test_runner.bash <type>"
  echo "  <type>: e2e - to run the end to end tests (*.spec.js)"
  echo "          ct  - to run the component tests (*.spec.comp.js)"
  exit -1
fi

TEST_CMD="open"
if [ "$1" = "ct" ]
then
  TEST_CMD="open-ct"
fi

# There is a timeout on the yarn command use by
# npm in the Dockerfile that causes this script to fail if 
# it doesn't connect quickly enough.  But typically it will
# go through after a few tries.
INSTALLED=-1
while [ $INSTALLED -ne 0 ]
do 
  docker build -f ../docker/cypress/Dockerfile -t cypress:$FD_VER .
  INSTALLED=$?
  sleep 2s
done

docker run -it \
  -v $PWD:/fd2test/farmdata2_modules \
  -v $PWD/cypress:/fd2test/cypress \
  -v $PWD/cypress.json:/fd2test/cypress.json \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -w /fd2test \
  --rm \
  -e DISPLAY=$DISPLAY \
  --name fd2_cypress \
  --network docker_default \
  --entrypoint npx \
  cypress:$FD_VER cypress $TEST_CMD --project .
