import { apiRequest } from './APIRequestFunction.js';

describe('API Request Function', () => {
    var testURL
    var testArray
    
    beforeEach(() => {
        cy.login('restws1', 'farmdata2')
        testURL = 'http://fd2_farmdata2/log.json?type=farm_seeding'
        testArray = []
    })

    it('completes the request and puts the data into the passed array', () => {
        getAllPages(testURL, testArray)
        expect(testArray).to.have.length.of.at.least(1)
    })
})