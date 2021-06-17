import { apiRequest } from './APIRequestFunction.js';

describe('API Request Function', () => {
    var testURL
    var testArray
    
    beforeEach(() => {
        testURL = 'http://fd2_farmdata2/log.json?type=farm_seeding'
        testArray = []
    })

    it('completes the request and puts the data into the passed array', () => {
        testArray = apiRequest(testURL)
        expect(testArray).to.have.length.of.at.least(1)
    })
})