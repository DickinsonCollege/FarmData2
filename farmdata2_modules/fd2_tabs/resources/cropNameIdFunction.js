try {
    FarmData2
}
catch{
    axios = require('axios')
}
function getResponse(){
    return new Promise((resolve, reject) => {
        let cropNameIdMap = 5
        response = axios.get('/farm_asset.json?type=planting')

        if(cropNameIdMap != null){
            return resolve(response)
        }
        else{
            return reject('Nothing in the Map')
        }
        
    })
}
function cropMap(){
   return axios.get('/farm_asset.json?type=planting')
        .then(response => {
            let cropMap = new Map
            console.log(response)
            console.log(cropMap)
            response.data.list.map(h => {
                cropMap[h.id] = h.name
            })
            console.log(cropMap)
            resolve(cropMap)
        })
}
try{
    module.exports = {
        cropMap: cropMap
    }
}
catch(err) {}