#!/bin/bash

# Generate the documentation for the Javascript libraries
# the VueJS components and the API.

if ! command -v jsdoc -c JSDoc.json &> /dev/null
then
    echo "JSDoc is not fully installed."
    echo "The necessary modules can be found in the `docker/dev/Dockerfile`."
    exit -1
fi

rm -rf doc

jsdoc ./farmdata2_modules/resources -r -c ./jsdoc/JSDoc.json -d doc
jsdoc ./farmdata2_api/src -r -c ./jsdoc/JSDoc.json -d doc
