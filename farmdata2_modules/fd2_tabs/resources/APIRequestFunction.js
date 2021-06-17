try {
    FarmData2
}
catch {
    axios = require('axios')
}

/*
function recursiveAPICall(url) {
    console.log('start of recursiveAPICall')
    let requestURL = url
    let response = null

    console.log('before api call')
    response = axios.get(requestURL)
        console.log('after api call')
        next = response.data.next  
        console.log(next)            
        if (typeof next == 'undefined') {
            console.log('in the if')
            return response
        }
        else {
            console.log('in the else')
            fullRequestURL = response.data.next
            requestURL = fullRequestURL.substring(16, fullRequestURL.length);

            fullResponse = [].concat(response, this.apiRequest(requestURL));

            console.log(response)
            return fullResponse
        }

} */

function apiCall(url) {
    let requestURL = url
    let response = null

    response = axios.get(requestURL)

    next = response.data
    
    return response
}

function apiRequest(url) {
    return new Promise ((resolve, reject) => {
        response = this.apiCall(url)

        if (response != null) {
            resolve(response)
        }
        else {
            reject('API request failed')
        }
    })
}



/*
function apiRequest(url, responseArray) {
            let requestURL = url
            responseArray = [1]
            //let responseArray = []

                axios.get(requestURL)
                    .then(response => {
                        next = response.data.next
                        
                        if (typeof next == 'undefined') {
                            return response.data.list
                        }
                        else {
                            fullRequestURL = response.data.next
                            requestURL = fullRequestURL.substring(16, fullRequestURL.length);

                            responseArray = response.data.list

                            responseArray = [].concat(responseArray, this.apiRequest(requestURL));
                        }
                    })
                return responseArray
}
*/

try {
    module.exports = {
        apiRequest: apiRequest
    }
}
catch(err) {}