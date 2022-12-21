/**
 * The Cache subtab demonstrates how pages can use a local cache to 
 * store api results locally. This allows pages to be displayed more
 * quickly when revisted (e.g. the full list of crops) because they do
 * not have to wait for an API call to return.  This spec tests that the
 * subtab is using the cache for a list of crops.
 */

describe('test caching of responses in local storage', () => {

    before(() => {
        // Delete the crops from local storage if it is there
        // before running our tests.  
        localStorage.removeItem('crops')
    })

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')

        // Cypress clears the local storage between each test.  
        // So we save it at the end of each test (see afterEach) and then restore 
        // it beore each test (here).  
        // 
        // Note: restoreLocalStorage and saveLocalStorage are custom cypress commands 
        // defined in the farmdata2_modules/cypress/support/commands.js file.
        cy.restoreLocalStorage()

        cy.visit('/farm/fd2-example/cache')

        // Note: We do not wait for this page to load, because once it has
        // the cache will have been created.
    })

    afterEach(() => {
        // Save the local storage at the end of each test so 
        // that it can be restored at the start of the next 
        // (see beforeEach).
        cy.saveLocalStorage()
    })

    it('Check that the cache does not exist the first time the page is loaded.', () => {
        // This needs to be the first test run to work properly.

        // First time through the crops should not be cached.
        // Note the cached value is cleared in the before().
        let crops = localStorage.getItem('crops')
        expect(crops).to.equal(null)

        // Spot check some crops once the page actually loads.
        cy.get('[data-cy=1crop]').should('have.text','ARUGULA')
        cy.get('[data-cy=50crop]').should('have.text','HERB-PARSLEY ROOT')
        cy.get('[data-cy=111crop]').should('have.text','ZUCCHINI')
    })

    it('Check that the cache does exist the second time the page is loaded.', () => {
        // Second time through the crops should be cached.
        let crops = localStorage.getItem('crops')
        expect(crops).to.not.equal(null)

        // Spot check some crops that would have been loaded from the cache.
        cy.get('[data-cy=1crop]').should('have.text','ARUGULA')
        cy.get('[data-cy=50crop]').should('have.text','HERB-PARSLEY ROOT')
        cy.get('[data-cy=111crop]').should('have.text','ZUCCHINI')
    })

    it('Click the Clear The Cache button and ensure that the cache is cleared.', () => {
        // wait for the page to load then click the "Clear the Cache" button.
        let crops = null
        cy.get('[data-cy=1crop]').should('have.text','ARUGULA')
       
        // Click the clear cache button.
        cy.get('[data-cy=clear-cache]').click()
        .then(() => {
            crops = localStorage.getItem('crops')
            // Now crops should not be in the cache
            expect(crops).to.equal(null) 
 
            // Reload the page 
            cy.reload(true)
        })

        // Once the response returns the crops should be cached again.
        cy.get('[data-cy=1crop]').should('have.text','ARUGULA')
        .then(() => {
            crops = localStorage.getItem('crops')
            expect(crops).to.not.equal(null)
        })
    })
})