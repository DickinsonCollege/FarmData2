#!/bin/bash

# Generate the documentation for the Javascript libraries
# and the VueJS components.

if ! command -v jsdoc &> /dev/null
then
    echo "JSDoc is not installed."
    echo "See directions in the README.md file."
    exit
fi

rm -rf doc

jsdoc FarmOSAPI.js -d doc
