# Resources

This directory contains JavaScript library functions, CSS definitions and VueJS Components that are used throughout FarmData2.  The `doc` directory contains documentation for these functions and components that is generated from the comments that they contain.  If changes or additions are made to the set of functions or components in this directory, the documentation should be regenerated as described below under _Documentation Tools_ and _Generating Documentation_.

## The Documentation

To see the documentation open `doc/index.html` in a browser.

### Documentation Tools

The documentation for the Javascript library functions are generated using [JSDoc](https://github.com/jsdoc/jsdoc) and the documentation for the VueJS components is also generated using JSDoc with the [JSDoc for VueJS Plugin](https://github.com/Kocal/jsdoc-vuejs/tree/3.x).

The versons that are installed in the Development Environment can be found in the `docker/dev/Dockerfile`.

### Generating Documentation

To generate the documentation:

1. Change into the `resources` directory.
2. `./doc.bash`

The documentation files will be generated in the `doc` directory within the `resources` directory.

If new components or js file are added, the `doc.bash` script may also need to be updated to incorporate them.
