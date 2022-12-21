/**
 * The API Error Handling section of the UI subtab illustrates how
 * the page should display error banners for network issues.  This
 * spec tests that the behavior of the error banner is correct
 * for the UI subtab example.
 */
describe('Test the the api error handler example', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('forefully trigger an error code not within 2xx', () => {
        cy.get('[data-cy=alert-err-handler]')
            .should('not.visible')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
            
        cy.intercept('GET', '/farm/fd2-example/abc',{ statusCode: 500 })
            .as('getServerFailure')
        
        cy.get('[data-cy=fetch-err-api]')
            .click()
        cy.wait('@getServerFailure')

        cy.get('[data-cy=alert-err-handler]')
            .should('be.visible')
        cy.get('[data-cy=first-log-name]')
            .should('have.text','')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
        cy.get('[data-cy=last-log-name]')
            .should('have.text','')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
        cy.get('[data-cy=last-log-name]')
            .should('have.text','')
    
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')

        cy.get('[data-cy=alert-err-handler]')
            .should('be.visible')
            .click()
            .should('not.visible')
    })

    it('forcefully trigger a network failure error', () => {
        cy.get('[data-cy=alert-err-handler]')
            .should('not.visible')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
        
        cy.intercept('GET', '/farm/fd2-example/abc', { forceNetworkError: true })
            .as('getNetworkFailure')
        
        cy.get('[data-cy=fetch-err-api]')
            .click()
        cy.wait('@getNetworkFailure')
    
        cy.get('[data-cy=alert-err-handler]')
            .should('be.visible')
        cy.get('[data-cy=first-log-name]')
            .should('have.text','')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
        cy.get('[data-cy=last-log-name]')
            .should('have.text','')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
        cy.get('[data-cy=last-log-name]')
            .should('have.text','')
    
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')

        cy.get('[data-cy=alert-err-handler]')
            .should('be.visible')
            .click()
            .should('not.visible')
    })

    it('something happened while setting up the request that triggered an error', () => {
        cy.get('[data-cy=alert-err-handler]')
            .should('not.visible')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
        
        cy.get('[data-cy=fetch-err-api]')
            .click()
    
        cy.get('[data-cy=alert-err-handler]')
            .should('be.visible')
        cy.get('[data-cy=first-log-name]')
            .should('have.text','')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
        cy.get('[data-cy=last-log-name]')
            .should('have.text','')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
        cy.get('[data-cy=last-log-name]')
            .should('have.text','')
    
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')

        cy.get('[data-cy=alert-err-handler]')
            .should('be.visible')
            .click()
            .should('not.visible')
    })
})
