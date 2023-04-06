/**
 * The API Error Handling section of the UI subtab illustrates how
 * pages should display error banners for network issues.  This
 * spec tests that the banner is displayed when network errors 
 * occur.
 */
describe('Test the display of the error banner when network errors occur.', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('Click Fetch button but force bad status and check error banner is shown.', () => {
        cy.get('[data-cy=api-err-banner]')
            .should('not.visible')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
            
        cy.intercept('GET', '/farm/fd2-example/abc', { statusCode: 500 })
            .as('getServerFailure')
        
        cy.get('[data-cy=fetch-err-api]')
            .click()
        cy.wait('@getServerFailure')

        cy.get('[data-cy=api-err-banner]')
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

        cy.get('[data-cy=api-err-banner]')
            .should('be.visible')
        cy.get('[data-cy=api-err-banner] > [data-cy=banner-close]')
            .click()
        cy.get('[data-cy=api-err-banner]')
            .should('not.visible')
    })

    it('Click Fetch button but force network failure and check error banner is shown.', () => {
        cy.get('[data-cy=api-err-banner]')
            .should('not.visible')
        cy.get('[data-cy=loading-err-spinner]')
            .should('not.exist')
        
        cy.intercept('GET', '/farm/fd2-example/abc', { forceNetworkError: true })
            .as('getNetworkFailure')
        
        cy.get('[data-cy=fetch-err-api]')
            .click()
        cy.wait('@getNetworkFailure')
    
        cy.get('[data-cy=api-err-banner]')
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

        cy.get('[data-cy=api-err-banner]')
            .should('be.visible')
        cy.get('[data-cy=api-err-banner] > [data-cy=banner-close]')
            .click()
        cy.get('[data-cy=api-err-banner]')
            .should('not.visible')
    })
})
