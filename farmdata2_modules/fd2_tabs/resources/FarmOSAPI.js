try {
    FarmData2
}
catch {
    axios = require('axios')
}

// A collection of functions for interacting with the 
// farmOS API.  All pages should use these so that any
// updates apply to all pages.

function getAllPages(url, arr=[]) {
    // Retrieves all pages of a multipage response.
    // Usage:   
    //    let result = []
    //    getAllPages(url, result)
    //       The result array will be filled with the elements from
    //       response.data.list from all of the pages.  Each page of
    //       responses is added to the array as it is retrieved.
    // OR:
    //    result = getAllPages(url)
    //        A new array is created, filled and returned.

    return new Promise((resolve, reject) => {
        axios.get(url)
        .then(function(response) {
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

function getIDToUserMap(){
    // Creates and returns a map from uid to username.
    return getMap('/user', 'uid', 'name')
}

function getUserToIDMap(){
    // Creates and returns a map from username to uid.
    return getMap('/user', 'name', 'uid')
}

function getIDToCropMap(){
    // Creates and returns a map from crop tid to crop name.
    return getMap('/taxonomy_term.json?bundle=farm_crops', 'tid', 'name')
}

function getCropToIDMap(){
    // Creates and returns a map from crop name to crop tid.
    return getMap('/taxonomy_term.json?bundle=farm_crops', 'name', 'tid')
}

function getIDToAreaMap(){
    // Creates and returns a map from area tid to area name.
    return getMap('/taxonomy_term.json?bundle=farm_areas', 'tid', 'name')
}

function getAreaToIDMap(){
    // Creates and returns a map from area name to area tid.
    return getMap('/taxonomy_term.json?bundle=farm_areas', 'name', 'tid')
}

function getUnitToIDMap(){
    //create and returns a map from unit name to unit tid.
    return getMap('/taxonomy_term.json?bundle=farm_quantity_units', 'name', 'tid')
}

function getIDToUnitMap(){
    //create and returns a map from unit tid to unit name
    return getMap('/taxonomy_term.json?bundle=farm_quantity_units', 'tid', 'name')
}

function getIDToLogTypeMap(){
    //create and return a map from log type tid to log type name
    return getMap('/taxonomy_term.json?bundle=farm_log_categories', 'tid', 'name')
}

function getLogTypeToIDMap(){
    //create and return a map from log type name to log type tid
    return getMap('/taxonomy_term.json?bundle=farm_log_categories', 'name', 'tid')
}

function getMap(url, key, value){
    // Utility function used by the above functions to get the appropraite maps.
    return new Promise((resolve, reject) => {
        getAllPages(url)
        .then(function(list) {
            resolve(new Map(list.map(h => 
                [h[key], h[value]]
            )))
        })
        .catch(function(error) {
            reject(error)
        })
    })
}

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

function createRecord(url, data, sessionToken) {
    // Create a new record in the database using the given url and data.
    // The url can be any farmOS endpoint that can be used for creating records.
    //    Note: These do not include .json at the end of the endpoint.
    // It is the caller's responsibility to ensure that the format and content
    // of the data is appropriate for the endpoint.
    // Use getSessionToken prior to calling this function to get the token.
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
            console.log(error.response)
        })
    })
}

function updateRecord(url, updateData, sessionToken){
    // Update a record in the database using the given url and data.
    // The url can be any farmOS endpoint that can be used for updating records.
    // This will typically end with the id/tid/etc of the log, asset or term to
    // be updated.
    //    Note: These endpoints do not include the .json.
    // It is the caller's responsibility to ensure that the format and content
    // of the data is appropriate for the endpoint.
    // Use getSessionToken prior to calling this function to get the token.
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

function deleteRecord(url, sessionToken) {
    // Delete a record from the database using the given url.
    // The url can be any farmOS endpoint that can be used for deleting records.
    // This will typically end with the id/tid/etc of the log, asset or term to
    // be deleted.
    //    Note: These endpoints do not include the .json.
    // Use getSessionToken prior to calling this function to get the token.
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
 * 
 * @param {is the quantity array in the Direct/Tray Seeding log} quantity 
 * @param {*the label of the object whose index is being returned} label 
 * 
 * @returns The index of the object with the input label in the quantity array 
 * otherwise returns a negative -1
 */
function quantityLocation(quantity, label){
    for(i=0; i < quantity.length; i++){
        if(quantity[i].label == label){
            return i
        }
    }
    return -1
}

try {
    module.exports = {
        getAllPages: getAllPages,
        getIDToCropMap: getIDToCropMap,
        getIDToAreaMap: getIDToAreaMap,
        getIDToUserMap: getIDToUserMap,
        getCropToIDMap: getCropToIDMap,
        getAreaToIDMap: getAreaToIDMap,
        getUserToIDMap: getUserToIDMap,
        getUnitToIDMap: getUnitToIDMap,
        getIDToUnitMap: getIDToUnitMap,
        getIDToLogTypeMap: getIDToLogTypeMap,
        getLogTypeToIDMap: getLogTypeToIDMap,
        getSessionToken: getSessionToken,
        deleteRecord: deleteRecord,
        createRecord: createRecord,
        updateRecord: updateRecord,
        quantityLocation: quantityLocation
    }
}
catch {}