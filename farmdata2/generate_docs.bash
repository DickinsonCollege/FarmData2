#!/bin/bash

# Generate the documentation for the Javascript libraries
# the VueJS components and the API.

if ! command -v jsdoc -c JSDoc.json &> /dev/null
then
    echo "JSDoc is not fully installed."
    echo "The necessary modules can be found in the `docker/dev/Dockerfile`."
    exit -1
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo "Generating docs in $SCRIPT_DIR..."

echo "  Deleting old docs."
rm -rf $SCRIPT_DIR/doc

JSCONF=$SCRITP_DIR/jsdoc/JSDoc.json
echo "  Using JSDoc configuration from $JSCONF."

DOC_DIR=$SCRIPT_DIR/doc
echo "  Sending output to $DOC_DIR."

RESOURCES=$SCRIPT_DIR/farmdata2_modules/resources
echo "  Generating docs for $RESOURCES."
jsdoc $RESOURCES -r -c $JSCONF -d $DOC_DIR

API=$SCRIPT_DIR/farmdata2_api/src
echo "  Generating docs for $RESOURCES."
jsdoc $API -r -c $JSCONF -d $DOC_DIR

echo "Done."