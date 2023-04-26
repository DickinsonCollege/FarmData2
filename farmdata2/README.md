# FarmData2 Structure

Development work on FarmData2 can be divided into two main areas discussed in this document:
- Front End (farmOS Modules/Tabs, Vue Components, Utility Libraries, etc.)
- Back End (Custom FarmData2 API endpoints)

## Front End

The front end for FarmData2 is contained in the `farmdata2_modules` directory. More information about front-end development, documentation, and testing can be found in the:
  - [`README` in the `farmdata2_modules` directory](farmdata2_modules/README.md)

## Back End

The back end for FarmData2 is partially based on the farmOS API and partially based on the custom FarmData2 API contained in the `farmdata2_api` directory.  More information about back end development, documentation and testing can be found in the:
  - [FarmOS V1 API](https://v1.farmos.org/development/api/)
  - [`README` in the `farmdata2_api` directory](farmdata2_api/README.md)

## Documentation

Both the front end and back end of FarmData provide documentation. 

### Viewing Documentation

To see the documentation open `farmdata2/doc/index.html` in a browser.

Documentation is not stored in the repository and must be generated locally (above).

### Generating Documentation

To generate the documentation within the development environment

1. Ensure that you are in the `farmdata2` directory.
2. Run the script `./generate_docs.bash`.

The documentation files will be generated in the `doc` directory within the `farmdata2` directory.

### Writing Tests

The details about how tests are written can be found in the `README` files for the front-end and back-end development provided above.

### Documentation Tools

The documentation for FarmData2 is generated using [JSDoc](https://github.com/jsdoc/jsdoc) and the documentation for the VueJS components uses the [JSDoc for VueJS Plugin](https://github.com/Kocal/jsdoc-vuejs/tree/3.x). All necessary tools for generating the documentation are included in the development environment but should you want to install them on your host machine, the versions that are installed in the development environment can be found in the `docker/dev/Dockerfile`.

### Running Tests

Details about running the front-end and back-end tests can be found in the `README` files for the front-end and back-end development provided above.

### Writing Tests

Details about writing front-end and back-end tests can be found in the `README` files for the front-end and back-end development provided above.

