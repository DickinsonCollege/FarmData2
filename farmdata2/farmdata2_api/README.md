# FarmData2 API

The FarmData2 API provides a comprehensive endpoints to interact with the FarmData2 system. 

## Swagger Documentation

The Swagger documentation for the FarmData2 API is available at `/fd2_api/docs`. This documentation provides a detailed look at available endpoints, their parameters, and expected responses, adhering to the OpenAPI Specifications. 

For more information on the OpenAPI Specifications, visit [OpenAPI Specifications](https://www.openapis.org/).

## Creating API Endpoints

When adding new endpoints to the FarmData2 API, follow these guidelines to ensure consistency and maintainability:

### Automatic Swagger Documentation

All new API endpoints must automatically generate Swagger documentation. To achieve this, make sure your code adheres to the OpenAPI Specifications. 

### Endpoint Naming and Paths

Follow RESTful conventions for endpoint naming and paths. Names should be descriptive and use nouns rather than verbs. Paths should reflect the resources being accessed or manipulated. For example, use `/crops` for accessing crop data and `/crops/{id}` for specific crop instances.

### SQL Queries

For backend operations, especially those involving database interactions, follow best practices for writing SQL queries. Ensure your queries are efficient and secure, particularly guarding against SQL injection attacks. Use prepared statements and parameterized queries where possible.

To test your SQL queries, you can use the phpMyAdmin service available in the FarmData2 development environment. Access it via:

- **Development Environment**: `http://fd2_phpmyadmin`
- **Local Browser**: `http://localhost:8181`

Login credentials are provided for both `farm` and `root` users in the development documentation.

## Testing Endpoints

As of now, endpoint testing infrastructure is in the works (TODO). 

## Refactoring FarmOSAPI.js

To integrate new API endpoints or modify existing ones, you may need to update `FarmOSAPI.js`. `FarmOSAPI.js` contains mapping functions used across FarmData2 pages to interact with the FarmOS API. Please make sure your changes are backward compatible and well-documented to avoid breaking existing functionalities.

### Availability of phpMyAdmin ###

For developers working on back-end services and the FarmData2 data model, there is a phpMyAdmin service that can be connected to via a browser in the FarmData2 development environment at:

```
http://fd2_phpmyadmin
```  

To see the live database being used log into phpMyAdmin using the credentials:
  * Username: `farm`
  * Password: `farm`

You can also connect to phpMyAdmin as an administrator using the credentials:
  * Username: `root`
  * Password: `farm`

Note: You may also connect to the phpMyAdmin service from a browser in your host OS (e.g. MacOS, Windows, Linux) using the URL:
```
http://localhost:8181
```
