# The FarmData2 API

FarmData2 API uses Express.js to generate API endpoints based on SQL queries. On top of the [FarmOSAPI](../farmdata2_modules/resources/FarmData2.js), the FarmData2 API provides customized access to the FarmData2 database, allowing developers to create their own endpoints specific to the pages. The guidelines below explains how to create a new endpoint for FarmData2 as well as conventions for creating a new endpoint.
<br><br>
### Creating Farmdata2 API ###
All files related to FarmData2 API are in the [farmdata2_api folder](../farmdata2_api/). The endpoints must be added to the [app.js](../farmdata2_api/src/app.js) file inside the farmdata2_api folder. The structure of an endpoint must follow the following conventions. For the swagger documentation in the comment above the endpoint function, check [the api documentation section](#farmdata2-api-documentation). 
``` javascript
/**
 * @swagger
 * Swagger documentation for fd2_api/docs generation
 */
app.get("/collection/singleton", async (req, res) => {
  let conn; // Declare a variable for the connection
  try {
    conn = await pool.getConnection(); // Create a connection to the server
    var sql = 
    ` 
    SELECT JSON_OBJECTAGG(name, id) AS data
    FROM (
      SELECT id, t1.name
      FROM taxonomy_term_data AS t1
      JOIN taxonomy_vocabulary AS t2
      ON t1.id = t2.id
      WHERE t2.machine_name = "collection"
    ) t` 
    // Your SQL query should return a JSON representation of the table
    // using the JSON_OBJECTAGG command achieves this

    // Execute the query; JSON object saved inside the results variable
    const results = await conn.execute(sql); 
    
    // The results is remapped to the response as a separte JSON object 
    // without the header information (only contains the data)
    res.json(results[0].data);

  // error handling
  } catch (error) {
    throw error;
  } finally {

    // release resources if connection is still established
    if (conn) {
      conn.release();
    }
  }
});
``` 
The endpoints must follow the [standard REST API conventions](https://restfulapi.net/resource-naming/). Using phpMyAdmin to test the query and displaying the result can be extremely helpful when developers need to create an endpoint. The phpMyAdmin access to the database is provided at the [end of this documentation](#availability-of-phpmyadmin).

Once the endpoint is created, the response object can be tested using [Hoppscotch.io](https://www.hoppscotch.io) in the FarmData2 development environment. Note that a browser-specific plugin must be installed before using Hoppscotch.io to test the endpoints. To test the endpoints, simply type the endpoint, followed by `http://fd2_api`, in the search bar at the top of the page and click "Send". If the endpoint was constructed correctly, the desired output will be returned at the bottom of the page.

### FarmData2 API Documentation ###
FarmData2 API endpoint documentation is available at 
```

http://fd2_api/docs/
```
This 

- Will cover:
  - [x] Adding a function to the FarmData2/farmOS API library
  - [x] Using Hoppscotch to manually test API endpoints
  - Writing unit tests for a FarmData2/farmOS API library function
  - Adding a new FarmData2 API endpoint
  - Documenting a FarmData2 API endpoint
  - Writing unit tests for a FarmData2 API endpoint


### Availability of phpMyAdmin ###

For developers working on back-end services and the FarmData2 data model there is a phpMyAdmin service that can be connected to via a browser in the FarmData2 development environment at:

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