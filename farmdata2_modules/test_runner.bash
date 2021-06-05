#!/bin/bash

xhost + > /dev/null

# If Dockerfile in docker/cypress is changed update
# the version number here and below in the run command
# to the next increment so that it will rebuild for 
# anyone using it.
docker build -f ../docker/cypress/Dockerfile -t cypress:fd2.1 .

docker run -it \
  -v $PWD:/fd2test/farmdata2_modules \
  -v $PWD/cypress:/fd2test/cypress \
  -v $PWD/cypress.json:/fd2test/cypress.json \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -w /fd2test \
  --rm \
  -e DISPLAY=$DISPLAY \
  --entrypoint npx \
  cypress:fd2.1 cypress open-ct --project .
