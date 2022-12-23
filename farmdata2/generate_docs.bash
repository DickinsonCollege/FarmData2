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

JSCONF=$SCRIPT_DIR/jsdoc/JSDoc.json
echo "  Using JSDoc configuration from $JSCONF."

#TEMPLATE=tui.ejs
#echo "  Using templage $TEMPLATE."

DOC_DIR=$SCRIPT_DIR/doc
echo "  Sending output to $DOC_DIR."

README=$SCRIPT_DIR/jsdoc/README.md

RESOURCES=$SCRIPT_DIR/farmdata2_modules/resources
echo "  Generating docs for $RESOURCES."
#jsdoc $RESOURCES -r -c $JSCONF -t $TEMPLATE -d $DOC_DIR
jsdoc $RESOURCES -r -c $JSCONF -R $README -d $DOC_DIR

echo "Done."