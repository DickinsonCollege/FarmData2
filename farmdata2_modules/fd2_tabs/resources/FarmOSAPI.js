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

function getSessionToken() {
    return new Promise((resolve, reject) => {
        axios
        .get('/restws/session/token')
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

function deleteLog(url, deleteID, sessionToken) {
    // Need to retrive the session token when logged in and
    // use that in any requests that modify the database 
    // (i.e. PUT, POST, DELETE).
    //let id = parseInt(deleteID)
    url = url + deleteID
    axios
        .delete(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN' : sessionToken,
            }
        })
        .then(response => console.log(response))
        .catch(error => console.log(error))
}

function modifyLog(url, id, updateObject, sessionToken){
    url = url + logID
    axios
        .put(url, logObject, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN' : sessionToken,
            }
        })
        .then(response => console.log(response))
        .catch(error => console.log(error)) 
    
    /*for(i=0; i < this.logData.length; i++){
        if(this.logData[i].id === newObject.id){
            this.logData.splice(i, 1, newObject)
        }
    }*/
}

try {
    module.exports = {
        getAllPages: getAllPages,
        getSessionToken: getSessionToken,
        deleteLog: deleteLog
    }
}
catch {}