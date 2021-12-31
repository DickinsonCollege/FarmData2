# Resources

This directory contains JavaScript library functions, CSS defintions and VueJS Components that are used throughout FarmData2.  The `doc` directory contains documentation for these functions and components that is generated from the comments that they contain.  If changes or additions are made to the set of functions or components in this directory, the documentation should be regenerated as described below under _Documentation Tools_ and _Generating Documentation_.

## The Documentation

To see the documentation open `doc/index.html` in a browser.

### Documentation Tools

The documentation for the Javascript library functions are generated using [JSDoc](https://github.com/jsdoc/jsdoc) and the documention for the VueJS components is also generated using JSDoc with the [JSDoc for VueJS Plugin](https://github.com/Kocal/jsdoc-vuejs/tree/3.x). 

To install the necessary tools:

1. `sudo apt install npm`
2. `sudo npm install -g jsdoc@3.6.7 jsdoc-vuejs@3.0.9 vue-template-compiler@2.6.14`

### Generating Documentation

To generate the documentation:

1. Change into the `resources` directory.
2. Run the `doc.bash` script.

The documentation files will be generated in the `doc` directory within the `resources` directory.

If new components or js file are added, the `doc.bash` script may also need to be updated to incorportate them.