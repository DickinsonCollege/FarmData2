#!/bin/bash

# Generate the documentation for the Javascript libraries
# and the VueJS components.

if ! command -v jsdoc -c JSDoc.json &> /dev/null
then
    echo "JSDoc is not fully installed."
    echo "See directions in the README.md file."
    exit
fi

rm -rf doc

jsdoc -c JSDoc.json * -d doc
