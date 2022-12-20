describe('test caching of responses in local storage', () => {

    before(() => {
        // Delete the crops from local storage if it is there
        // before running our tests.  
        localStorage.removeItem('crops')
    })

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')

        // Cypress clears the local storage between each test.  
        // So we need to save it at the end of each test (see afterEach)
        // and then restore beore each test (here).  
        // Note: restoreLocalStorage and saveLocalStorage are custom commands 
        // defined in the farmdata2_modules/cypress/support/commands.js file.
        cy.restoreLocalStorage()

        cy.visit('/farm/fd2-example/cache')
    })

    afterEach(() => {
        // Save the local storage at the end of each test so 
        // that it can be restored at the start of the next 
        // (see beforeEach).
        cy.saveLocalStorage()
    })

    it('test the first visit to the page (i.e. no cached crops)', () => {
        // This needs to be the first test run to work properly.

        // First time through the crops should not be cached.
        // Note the cached value is cleared in the before().
        let crops = localStorage.getItem('crops')
        expect(crops).to.equal(null)

        cy.get('[data-cy=1crop]').should('have.text','ARUGULA')
        cy.get('[data-cy=50crop]').should('have.text','HERB-PARSLEY ROOT')
        cy.get('[data-cy=111crop]').should('have.text','ZUCCHINI')
    })

    it('test a second visit to the page (i.e. with cached crops', () => {
        // Second time through the crops should be cached.
        let crops = localStorage.getItem('crops')
        expect(crops).to.not.equal(null)

        cy.get('[data-cy=1crop]').should('have.text','ARUGULA')
        cy.get('[data-cy=50crop]').should('have.text','HERB-PARSLEY ROOT')
        cy.get('[data-cy=111crop]').should('have.text','ZUCCHINI')
    })

    it('test clearing the cache', () => {
        // wait for the page to load then click the "Clear the Cache" button.
        let crops = null
        cy.get('[data-cy=1crop]').should('have.text','ARUGULA')
        .then(() => {
            cy.get('[data-cy=clear-cache]').click({force:true})
            crops = localStorage.getItem('crops')
        })
    
        // Now crops should not be in the cache
        expect(crops).to.equal(null)
   
        // Now reload the page 
        cy.reload(true)

        // Once the response returns the crops should be cached again.
        cy.get('[data-cy=1crop]').should('have.text','ARUGULA')
        .then(() => {
            crops = localStorage.getItem('crops')
            expect(crops).to.not.equal(null)
        })
    })
})