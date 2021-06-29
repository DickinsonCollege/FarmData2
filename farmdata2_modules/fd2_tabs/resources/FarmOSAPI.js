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
    //
    // The result array will be filled with the elements from
    // response.data.list from all of the pages.  Each page of
    // responses is added to the array as it is retrieved.
    
    return new Promise((resolve, reject) => {
        axios.get(url)
        .then(function(response) {
            arr.push.apply(arr,response.data.list)
            return response.data
        })
        .then(function(data) {
            //arr.push.apply(arr,data.list)
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
    return getMap('/user', 'uid', 'name')
}

function getUserToIDMap(){
    return getMap('/user', 'name', 'uid')
}

function getIDToCropMap(){
    return getMap('/taxonomy_term.json?bundle=farm_crops', 'tid', 'name')
}

function getCropToIDMap(){
    return getMap('/taxonomy_term.json?bundle=farm_crops', 'name', 'tid')
}

function getIDToFieldMap(){
    return getMap('/taxonomy_term.json?bundle=farm_areas', 'tid', 'name')
}

function getFieldToIDMap(){
    return getMap('/taxonomy_term.json?bundle=farm_areas', 'name', 'tid')
}

function getMap(url, key, value){
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

function updateRecord(url, updateData, sessionToken){
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
        deleteRecord: deleteRecord,
        createRecord: createRecord,
        updateRecord: updateRecord
    }
}
catch {}