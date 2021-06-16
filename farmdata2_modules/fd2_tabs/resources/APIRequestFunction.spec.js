import { apiRequest } from './APIRequestFunction.js';
let val = apiRequest();  // val is "Hello";

describe('API Request Function', () => {
    beforeEach(() => {
        const testURL = '/log.json?type=farm_seeding'
        const testArray = []
    })

    it('completes the request and puts the data into the passed array', () => {
        expect(apiRequest(testURL,testArray)).to.not.be.empty
    })
})