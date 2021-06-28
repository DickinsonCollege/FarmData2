try {
    FarmData2
}
catch {
    axios = require('axios')
}

// A collection of functions for interacting with the 
// farmOS API.  All pages should use these so that any
// updates apply to all pages.

function getAllPages(url, arr) {
    // Retrieves all pages of a multipage response.
    // Usage:   
    //    let result = []
    //    getAllPages(url, result)
    //
    // The result array will be filled with the elements from
    // response.data.list from all of the pages.  Each page of
    // responses is added to the array as it is retrieved.
    
    return new Promise((resolve, reject) => {
        axios.get(url)
        .then(function(response) {
            return response.data
        })
        .then(function(data) {
            arr.push.apply(arr,data.list)
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

function getIDToCropMap(){
    return getMap('/taxonomy_term.json?bundle=farm_crops', 'tid', 'name')
}

function getIDToFieldMap(){
    return getMap('/taxonomy_term.json?bundle=farm_areas', 'tid', 'name')
}

function getIDToUserMap(){
    return getMap('/user', 'uid', 'name')
}

function getCropToIDMap(){
    return getMap('/taxonomy_term.json?bundle=farm_crops', 'name', 'tid')
}

function getFieldToIDMap(){
    return getMap('/taxonomy_term.json?bundle=farm_areas', 'name', 'tid')
}

function getUserToIDMap(){
    return getMap('/user', 'name', 'uid')
}

function getMap(url, key, value){
    return new Promise((resolve, reject) => {
        axios.get(url)
        .then(function(response) {
            return response.data.list
        })
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

function createLog(url, newLogObject, sessionToken) {
    return new Promise((resolve, reject) => {
        logObject = this.logToCreate

        axios
        .post(url, newLogObject, {
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

function deleteLog(logID, sessionToken) {
    return new Promise((resolve, reject) => {
        url = '/log/' + logID
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

try {
    module.exports = {
        getAllPages: getAllPages,
        getIDToCropMap: getIDToCropMap,
        getIDToFieldMap: getIDToFieldMap,
        getIDToUserMap: getIDToUserMap,
        getCropToIDMap: getCropToIDMap,
        getFieldToIDMap: getFieldToIDMap,
        getUserToIDMap: getUserToIDMap,
        getSessionToken: getSessionToken,
        deleteLog: deleteLog,
        createLog: createLog
    }
}
catch {}