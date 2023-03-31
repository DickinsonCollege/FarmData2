# FarmData2 Organization

This document discusses the overall organization of the FarmData2 repository.  It outlines the major parts of the project, the technologies used in each part, and points to more specialized documentation on each part.

FarmData2 is broadly organized into the following areas:

- **Infrastructure** - The infrastructure provides the tools and resources necessary to get a FarmData2 instance up and running.  It uses Docker, docker-compose, and bash scripts.  Details of the infrastructure can be found in:
  - [the `README` in the `docker` directory](../docker/README.md)

- **Sample Database** - The sample database provides developers with a pre-populated anonymized data from the Dickinson College farm.  The sample data covers one full growing season and half of the following season.  Details of the sample database, including the data it contains, how to re-build it, and how to expand it can be found in:
  - [the `README` in the `sampleDB` directory](../docker/sampleDB/README.md)

- **FarmData2 Modules** - The FarmData2 modules are the user-facing pages that appear in the farmOS user interface when FarmData2 is installed (e.g. the *Barn Kit*, *Field Kit*, and their sub-tabs, such as the *Seeding Report* and *Seeding Input*).  Each FarmData2 module is defined as a single HTML page that uses HTML, CSS, JavaScript, Vue.js, and Bootstrap to create the user interface and to send/receive data.  The individual pages are themselves contained in Drupal modules so that they can be loaded into the farmOS application (which is based on Drupal).  Details of the FarmData2 modules can be found in:
  - [the `README` in the `farmdata2/farmdata2_modules` directory](../farmdata2/farmdata2_modules/README.md)

- **FarmData2 API** - FarmData2 often requires specific collections of data that cannot be retrieved efficiently using the API provided by the underlying farmOS project.  Thus, FarmData2 provides a custom API that allows FarmData2 modules to easily retrieve the data that they need.  The API endpoints are typically specialized and tightly coupled to the reports and input forms.  Note that the FarmData2 API is used only from reading data.  All writing of data is done via the farmOS API to ensure that all data stored is fully farmOS compatible.  The details of the FarmData2 API can be found in:
  - [the `README` in the `farmdata2/farmdata2_api` directory](../farmdata2/farmdata2_api/README.md)