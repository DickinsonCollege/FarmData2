try {
    FarmData2
}
catch {
    axios = require('axios')
}

function apiRequest(url) {
            let requestURL = url

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

                            return responseArray
                        }
                })
}

try {
    module.exports = {
        apiRequest: apiRequest
    }
}
catch(err) {}