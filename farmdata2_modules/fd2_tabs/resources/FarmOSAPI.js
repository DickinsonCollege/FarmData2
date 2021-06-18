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
    // Concatenates the contents of the list property from 
    // all pages of a multipage response into arr
    return new Promise((resolve, reject) => {
        
        axios.get(url)
        .then(function(response) {
            return JSON.parse(response.data)
        })
        .then(function(data) {
            arr.push.apply(arr,data.list)

            if (!data.hasOwnProperty('next')) {
                resolve()
            }
            else {
                getAllPages(data.next, arr)
                .then(function() {
                    resolve()
                })
            }
        })
        .catch(function(error) {
            reject(error)
        })
    })
}

try {
    module.exports = {
        getAllPages: getAllPages
    }
}
catch(err) {}