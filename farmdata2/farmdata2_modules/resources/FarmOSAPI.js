/**
 * A collection of functions for interacting with the
 * farmOS API. All pages should use these so that any
 * updates apply to all pages.
 */

try {
    FarmData2
}
catch {
    var axios = require('axios')
}

/**
 * Make a GET request to an API endpoint and retrieve all pages of a multipage responses.
 *
 * If there are data properties in the logs, they are parsed into JSON before the response is returned.  Thus, properties in the data field can be accessed normally without parsing when the record is retrieved using this function.
 * 
 * @param {string} endpoint the API endpoint including any query parameters.  Note: This does not include http://localhost/ or other server address.
 * @param {array} [arr] optionally an array that will be filled with the records as they are returned.  If omitted a new array will be returned when the request completes.
 *
 * @returns a Promise that when resolved yields the array with all of the records from all of the pages of the response.
 *
 * @example <caption>Retrieve all harvest logs into the result array.</caption>
 * // Assumes that result is an existing array
 * getAllPages('/log.json?type=farm_harvest', result)
 * .then(() => {
 *     // All of the requested records have now been added to result.
 *     // Additional processing can happen here if necessary,
 *     // or then may be omitted.
 * })
 * .catch((err) => {
 *     // An error occurred during the requests, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Result will not yet contain records but will be filled as responses are received.
 * // The result will contain all records when then() is invoked.
 *
 * @example <caption>Retrieve all planting assets into a new array.</caption>
 * getAllPages('/farm_asset.json?type=planting')
 * .then((res) => {
 *     // res is a newly created array that is
 *     // filled with all of the requested records.
 * })
* .catch((err) => {
 *     // An error occurred during the requests, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 */
function getAllPages(endpoint, arr=[]) {
    return new Promise((resolve, reject) => {
        axios.get(endpoint)
        .then(function(response) {

            // Parse the custom FD2 data field in the JSON.
            response.data.list.map(log => {
                if (log.data != null) {
                    log.data = JSON.parse(log.data)
                }
            })

            arr.push.apply(arr,response.data.list)
            return response.data
        })
        .then(function(data) {
            if (!data.hasOwnProperty('next')) {
                resolve(arr)
            }
            else {
                return getAllPages(data.next, arr)
                .then(function() {
                    resolve(arr)
                })
            }
        })
        .catch(function(error) {
            reject(error)
        })
    })
}

/**
 * Get a Map from User ID (uid) to Username.  This function makes a request to the /user endpoint in the farmOS API to get the list of users and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with user uid as the key and username as the value.
 *
 * @example <caption>Get a Map from user uid to username.</caption>
 * getIDToUserMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getIDToUserMap(){
    return new Promise ((resolve, reject) => {
        axios.get("http://fd2_api/users/mapById")
        .then((response) => {
            resolve(new Map(Object.entries(response.data)))
        }).catch(function (err) {
            reject(err)
        })
    })
}

/**
 * Get a Map from Username to User ID (uid).  This function makes a request to the /user endpoint in the farmOS API to get the list of users and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with username as the key and user uid as the value.
 *
 * @example <caption>Get a Map from username to user uid.</caption>
 * getUserToIDMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getUserToIDMap(){
    return new Promise ((resolve, reject) => {
        axios.get("http://fd2_api/users/mapByName")
        .then((response) => {
            resolve(new Map(Object.entries(response.data)))
        }).catch(function (err) {
            reject(err)
        })
    })
}

/**
 * Get a Map from Crop ID (tid) to Crop Name.  This function makes a request to the /taxonomy_term.json?bundle=farm_crops endpoint in the farmOS API to get the list of crops and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with Crop ID (tid) as the key and the Crop Name as the value.
 *
 * @example <caption>Get a Map from crop tid to crop name.</caption>
 * getIDToCropMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getIDToCropMap(){
    return new Promise ((resolve, reject) => {
        axios.get("http://fd2_api/crops/mapById")
        .then((response) => {
            resolve(new Map(Object.entries(response.data)))
        }).catch(function (err) {
            reject(err)
        })
    })
}

/**
 * Get a Map from Crop Name to Crop ID (tid).  This function makes a request to the /taxonomy_term.json?bundle=farm_crops endpoint in the farmOS API to get the list of crops and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with Crop Name as the key and the Crop ID (tid) as the value.
 *
 * @example <caption>Get a Map from crop name to crop tid.</caption>
 * getCropToIDMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getCropToIDMap(){
    return new Promise ((resolve, reject) => {
        axios.get("http://fd2_api/crops/mapByName")
        .then((response) => {
            resolve(new Map(Object.entries(response.data)))
        }).catch(function (err) {
            reject(err)
        })
    })
}

/**
 * Get a Map from Area ID (tid) to Area Name.  This function makes a request to the /taxonomy_term.json?bundle=farm_areas endpoint in the farmOS API to get the list of crops and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with Area ID (tid) as the key and the Area Name as the value.
 *
 * @example <caption>Get a Map from area tid to area name.</caption>
 * getIDToAreaMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getIDToAreaMap(){
    return new Promise ((resolve, reject) => {
        axios.get("http://fd2_api/areas/mapById")
        .then((response) => {
            resolve(new Map(Object.entries(response.data)))
        }).catch(function (err) {
            reject(err)
        })
    })
}

/**
 * Get a Map from Area ID (tid) to Area Name.  This function makes a request to the /taxonomy_term.json?bundle=farm_areas endpoint in the farmOS API to get the list of areas and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with Area Name as the key and the Area ID (tid) as the value.
 *
 * @example <caption>Get a Map from area name to area tid.</caption>
 * getAreaToIDMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getAreaToIDMap(){
    return new Promise ((resolve, reject) => {
        axios.get("http://fd2_api/areas/mapByName")
        .then((response) => {
            resolve(new Map(Object.entries(response.data)))
        }).catch(function (err) {
            reject(err)
        })
    })
}

/**
 * Get a Map from Unit ID (tid) to Unit Name.  This function makes a request to the /taxonomy_term.json?bundle=farm_quantity_units endpoint in the farmOS API to get the list of units and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with Unit ID (tid) as the key and the Unit Name as the value.
 *
 * @example <caption>Get a Map from unit tid to unit name.</caption>
 * getIDToUnitMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getIDToUnitMap(){
    //create and returns a map from unit tid to unit name
    return getMap('/taxonomy_term.json?bundle=farm_quantity_units', 'tid', 'name')
}

/**
 * Get a Map from Unit Name to Unit ID (tid).  This function makes a request to the /taxonomy_term.json?bundle=farm_quantity_units endpoint in the farmOS API to get the list of units and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with Unit Name as the key and the Unit ID (tid) as the value.
 *
 * @example <caption>Get a Map from unit name to unit tid.</caption>
 * getUnitToIDMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getUnitToIDMap(){
    return getMap('/taxonomy_term.json?bundle=farm_quantity_units', 'name', 'tid')
}

/**
 * Get a Map from Log Type ID (tid) to Lot Type Name.  This function makes a request to the /taxonomy_term.json?bundle=farm_log_categories endpoint in the farmOS API to get the list of log types and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with Log Type ID (tid) as the key and the Log Type Name as the value.
 *
 * @example <caption>Get a Map from log type tid to log type name.</caption>
 * getIDToLogTypeMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getIDToLogTypeMap(){
    return getMap('/taxonomy_term.json?bundle=farm_log_categories', 'tid', 'name')
}

/**
 * Get a Map from Log Type Name to Lot Type ID (tid).  This function makes a request to the /taxonomy_term.json?bundle=farm_log_categories endpoint in the farmOS API to get the list of log types and converts the result to a Map.
 *
 * @returns A Promise that when resolved yields a Map with Log Type Name as the key and the Log Type ID (tid) as the value.
 *
 * @example <caption>Get a Map from log type name to log type tid.</caption>
 * getLogTypeToIDMap()
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getLogTypeToIDMap(){
    //create and return a map from log type name to log type tid
    return getMap('/taxonomy_term.json?bundle=farm_log_categories', 'name', 'tid')
}

/**
 * General utility function for making Maps between taxonomy terms and their tids.  This function is primarily used by the convenience functions that return a specific Map.  If you plan to use this function, first check if there is already a convenience function for the Map you want.  Then if not, consider adding a convenience function instead of using this function directly.
 *
 * @param {string} url the farmOS API endpoint from which to retrieve the data for the Map.
 * @param {string} key the name of the property to be used as the key in the Map.
 * @param {string} value the name of the property to be used as the value in the Map.
 *
 * @returns a Promise that when resolved yields a new Map object from the specified key to the specified value.
 *
 * @example <caption>Get a new Map from User ID (uid) to User Name.</caption>
 * getMap('/user', 'uid', 'name')
 * .then((theMap) => {
 *     // Process the map.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 *
 */
function getMap(url, key, value){
    return new Promise((resolve, reject) => {
        getAllPages(url)
        .then(
            (list) => {
                resolve(new Map(list.map(h =>
                    [h[key], h[value]]
                )))
            },
            (error) => {
                reject(error)
            }
        )
    })
}

/**
 * Get the session token for the current login. The session token is required as a parameter for API requests that modify data (e.g. createRecord, modifyRecord, deleteRecord, etc).
 *
 * @returns A Promise that when resolved yields a string containing the session token for the current login.
 *
 * @example <caption>Get the session token for the current login.</caption>
 * getSessonToken()
 * .then((theToken) => {
 *     // Process the token.
 *     // Typically it is stored in the Vue data for later use.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the Map will not be available until the then() executes.
 */
function getSessionToken() {
    // Get the session token for the current login.
    // The session token is required for API requests that modify data.
    // E.g. createRecord, modifyRecord, deleteRecord.
    return new Promise((resolve, reject) => {
        axios.get('/restws/session/token')
        .then(response => {
            return response.data
        })
        .then(function(token) {
            resolve(token)
        })
        .catch(function(error){
            reject(error)
        })
    })
}

/**
 * Request a record from a farmOS API endpoint. This function should be used only to retrieve records that are known to be a single page (e.g. a single log, a single asset, etc.)  If a request might return multiple pages of records, the getAllPages function should be used instead.
 *
 * The data property of the response is parsed into JSON before the response is returned.  Thus, properties in the data field can be accessed normally without parsing when the record is retrieved using this function.
 *
 * @param {string} url the farmOS API endpoint from which to request the record.
 *
 * @returns A Promise that when resolved yields the response received from the farmOS server.
 *
 * @example <caption>Request log 123 in JSON format using its id</caption>
 * getRecord('/log.json?id=123')
 *     // Process the response.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the response will not be available until the then() executes.
 */
function getRecord(url) {
    return new Promise((resolve, reject) => {
        axios
        .get(url)
        .then((response) => {
            // The data property in farmOS is always a string but
            // FarmData2 uses it to hold JSON data.
            // So if we have a data property, parse it here so it
            // behaves just like any other property in the returned object.
            if (response.data.data != null) {
                response.data.data = JSON.parse(response.data.data)
            }
            resolve(response)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

/**
 * Request the FarmData2 configuration settings.
 *
 * The data property of the response is parsed into JSON before the response is returned.  Thus, properties in the data field can be accessed normally without parsing when the record is retrieved using this function.
 *
 * @returns A Promise that when resolved yields the response received from the farmOS server.
 *
 * @example <caption>Request the configuration.</caption>
 * getConfiguration()
 *     // Process the response.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the response will not be available until the then() executes.
 */
function getConfiguration() {
    return getRecord('/fd2_config/1')
}

/**
 * Delete a record from the database using a farmOS API endpoint. The currently logged in user must have sufficient privilege to delete records.
 * @param {string} url the farmOS API endpoint to use to delete the record.  Typically records are deleted using their id/tid/etc.
 * @param {string} sessionToken the session token for the current login sessions.  Use the getSessionToken() function to obtain it prior to calling this function.
 *
 * @returns A Promise that when resolved yields the response from the server when the deletion has completed.
 *
 * @example <caption>Delete asset 234 from the database</caption>
 * // Assume token has been set to the session token.
 * deleteRecord('/farm_asset/234', token)
 *    // The record was deleted.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the record will not have been deleted until the then() executes.
 */
function deleteRecord(url, sessionToken) {
    return new Promise((resolve, reject) => {
        axios
        .delete(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN' : sessionToken,
            }
        })
        .then((response) => {
            resolve(response)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

/**
 * Create a record in the database using a farmOS API endpoint. The currently logged in user must have sufficient privilege to create records.
 *
 * @param {string} url the farmOS API endpoint to use to create the record.
 * @param {string} data a JSON object containing the data for the record to be created.  The format of the data must match what is expected by the endpoint specified by the url. If a data property if present inside this object it should be standard JSON. This function will stringify it to meet the farmOS expectation that the value of the data property is a string.
 * @param {string} sessionToken the session token for the current login sessions.  Use the getSessionToken() function to obtain it prior to calling this function.
 *
 * @returns A Promise that when resolved yields the response from the server when the new record has been created.
 *
 * @example <caption>Create a new log in the database</caption>
 * // Assume logData contains the data for the new log.
 * // Assume token has been set to the session token.
 * createRecord('/log', logData, token)
 *    // The record was created.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the record will not have been created until the then() executes.
 */
function createRecord(url, data, sessionToken) {
    // If the incoming object has a data property then
    // it should be stringified because farmOS expects
    // data properties to be strings not JSON objects but
    // FarmData2 uses the data property to hold JSON.
    if (data.data != null) {
        data.data = JSON.stringify(data.data)
    }

    return new Promise((resolve, reject) => {
        axios
        .post(url, data, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': sessionToken,
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            resolve(response)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

/**
 * Update a record in the database using a farmOS API endpoint. The currently logged in user must have sufficient privilege to modify records.
 *
 * @param {string} url the farmOS API endpoint to use to update the record.
 * @param {string} updateData a JSON object containing the data to be updated in the record.  The format of the data must match what is expected by the endpoint specified by the url.  The data property if present should be standard JSON. This function will stringify it to meet the farmOS expectation that the value of the data property is a string.
 * @param {string} sessionToken the session token for the current login sessions.  Use the getSessionToken() function to obtain it prior to calling this function.
 *
 * @returns A Promise that when resolved yields the response from the server when the record has been updated.
 *
 * @example <caption>Update an asset in the database</caption>
 * // Assume assetUpdate contains the data to update in the asset.
 * // Assume token has been set to the session token.
 * updateRecord('/log', assetUpdate, token)
 *    // The record has been updated.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the record will not have been updated until the then() executes.
 */
function updateRecord(url, updateData, sessionToken){
    // If the incoming object has a data property then
    // it should be stringified because farmOS expects
    // data properties to be strings not JSON objects but
    // FarmData2 uses the data property to hold JSON.
    if (updateData.data != null) {
        updateData.data = JSON.stringify(updateData.data)
    }

    return new Promise((resolve, reject) => {
        axios
        .put(url, updateData, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN' : sessionToken,
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            resolve(response)
        })
        .catch(function(error) {
            reject(error)
        })
    })
}

/**
 * Update the configuration information.
 *
 * @param {string} updateData a JSON object containing the data to be updated in the record.  The format of the data must match what is expected by the endpoint specified by the url.  The data property if present should be standard JSON. This function will stringify it to meet the farmOS expectation that the value of the data property is a string.
 * @param {string} sessionToken the session token for the current login sessions.  Use the getSessionToken() function to obtain it prior to calling this function.
 *
 * @returns A Promise that when resolved yields the response from the server when the configuration has been updated.
 *
 * @example <caption>Update the configuration in the database</caption>
 * // Assume configUpdate contains the data to update.
 * // Assume token has been set to the session token.
 * setConfiguration(configUpdate, token)
 *    // The configuration has been updated.
 * })
 * .catch((err) => {
 *     // An error occurred during the request, process it here.
 * })
 * // Execution continues here immediately after the request is made.
 * // Note that the record will not have been updated until the then() executes.
 */
function setConfiguration(updateData, sessionToken) {
    return updateRecord('/fd2_config/1', updateData, sessionToken)
}

/**
 * Gets the index of a specified quantity object from the quantity array in a log (e.g. a direct or tray seeding, transplanting or harvest log).
 * @export
 * 
 * @param {array} quantity an array of quantity objects from a log
 * @param {string} label the value of the label property of which to find the index.
 *
 * @returns the index of the quantity object with the specified label.  Or -1 if no such object exists.
 *
 * @example <caption>Find the quantity object for the amount planted.</caption>
 * // assume seedingLog is a seeding log from the database.
 * let index = quantityLocation(seedingLog.quantity, 'Amount planted')
 */
function quantityLocation(quantity, label){
    for(let i=0; i < quantity.length; i++){
        if(quantity[i].label == label){
            return i
        }
    }
    return -1
}

try {
    /**
     * @export
     */
    module.exports = {
        getAllPages,
        getIDToCropMap,
        getIDToAreaMap,
        getIDToUserMap,
        getCropToIDMap,
        getAreaToIDMap,
        getUserToIDMap,
        getUnitToIDMap,
        getIDToUnitMap,
        getIDToLogTypeMap,
        getLogTypeToIDMap,
        getSessionToken,
        getRecord,
        deleteRecord,
        createRecord,
        updateRecord,
        quantityLocation,
        getConfiguration,
        setConfiguration,
    }
}
catch {}
