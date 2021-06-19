import { getAllPages } from './FarmOSAPI.js';

describe('API Request Function', () => {
    var testArray
    
    beforeEach(() => {
        cy.login('restws1', 'farmdata2')
        testArray = []
    })

    /*
    it.only('Test on a request with one page.', () => {
        // Note: For some reason the following does not work. It should
        // intercept all requests to log but it does not match any.
        // Maybe a cypress bug?  Maybe a future version will fix it?

        cy.intercept('GET','/log?').as('onlyone')
        getAllPages('/log?type=farm_seeding&id[lt]=1500', testArray)

        cy.wait('@onlyone').should(() => {
            cy.wrap(testArray).should('have.length.equal',100)
        })
    })
    */

    it('Test on a request with multiple pages', () => {
        // Note: For some reasson the following did not work to intecept
        // the original request.
        // cy.intercept('GET','/log?type=farm_seeding').as('original')
        // Maybe a cypress bug?  Maybe a future version will fix it?

        cy.intercept('GET','/log?type=farm_seeding&page=1').as('second')
        cy.intercept('GET','/log?type=farm_seeding&page=2').as('third')
        
        getAllPages('/log?type=farm_seeding', testArray)

        cy.wait('@second').should(() => {
            // Just by getting here we know the second page was requested.

            // Check that data made it into testArray.
            // Note: depending on timing this may not run until after any
            // subsequent calls.
            cy.wrap(testArray).should('have.length.gt',100)
        })

        cy.wait('@third').should(() => {
            cy.wrap(testArray).should('have.length.gt',200)
        })
    })
})