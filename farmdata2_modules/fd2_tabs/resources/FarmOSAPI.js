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

function getCropMap(){
    return getMap('/farm_asset.json?type=planting', 'id')
}

function getFieldMap(){
    return getMap('/taxonomy_term.json?bundle=farm_areas', 'tid')
}

function getUserMap(){
    return getMap('/user', 'uid')
}

function getMap(url, findID){
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(function(response) {
                console.log(response)
                return response.data.list
            })
            .then(function(list) {
                resolve(new Map(list.map(h => 
                    [h[findID], h.name]
                )))
            })
            .catch(function(error) {
                reject(error)
            })
    })
}

try {
    module.exports = {
        getAllPages: getAllPages,
        getCropMap: getCropMap,
        getFieldMap: getFieldMap,
        getUserMap: getUserMap
    }
}
catch {}