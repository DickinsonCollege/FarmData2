try {
    FarmData2
}
catch {
    axios = require('axios')
}

function helperAPIRequest(url) {
    return new Promise ((resolve, reject) => {
        let requestURL = url
        let response = null

        response = axios.get(requestURL)

        console.log(response)
        if (response != null) {
            console.log(response)
            return resolve(response)
        }
        else {
            return reject('API request failed')
        }
    })
}
function apiRequest(url) {
    return new Promise((resolve, reject) => {
        let next = null
        helperAPIRequest(url).then((response) => {
            console.log("finished calling helper method")
                next = response.data.next
                console.log(next)
            }).catch((failed) => {
                console.log('In the Catch')
            })

        if (next != null) {
            console.log(next)
            resolve('got next')
        }
        else {
            reject("no next")
        }
    })
}

try {
    module.exports = {
        apiRequest: apiRequest
    }
}
catch(err) {}