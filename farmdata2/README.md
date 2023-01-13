# FarmData2 Structure

## Front End

- modules
- components
- libraries
- example module

## Back End

- API

## Documentation

### Writing Documentation 

- JSDOC 
- Information is provided in the appropriate READMEs.

### Viewing Documentation

To see the documentation open `farmdata2/doc/index.html` in a browser.

Documentation is not stored in the repository and must be generated locally (below).

### Generating Documentation

To generate the documentation within the development environment:

1. Ensure that you are in the `farmdata2` directory.
2. Run the script `./generate_docs.bash`

The documentation files will be generated in the `doc` directory within the `farmdata2` directory.

### Documentation Tools

The documentation for FarmData2 is generated using [JSDoc](https://github.com/jsdoc/jsdoc) and the documentation for the VueJS components uses the [JSDoc for VueJS Plugin](https://github.com/Kocal/jsdoc-vuejs/tree/3.x).

All necessary tools for generating the documentation are included in the development environment but should you want to install them on you host machine, the versions that are installed in the development environment can be found in the `docker/dev/Dockerfile`.

## Testing

### Writing Tests
 
Described in the README in the appropriate locations (e.g. farmdata2_modules, farmdata2_api).  

### Running Tests

