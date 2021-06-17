export function apiRequest(url, responseArray) {
            let requestURL = url
                axios.get(requestURL)
                    .then(response => {
                        next = response.data.next
                        
                        responseArray = [].concat(responseArray, response.data.list);

                        if (typeof next == 'undefined') {
                            //do nothing, all done!
                        }
                        else {
                            fullRequestURL = response.data.next
                            requestURL = fullRequestURL.substring(16, fullRequestURL.length);

                            lastRequestURL = response.data.last
                            last = lastRequestURL.substring(16, lastRequestURL.length);

                            this.recursiveRequest(requestURL);
                        }
                })
}