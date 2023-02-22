/**
 * The BannerComponent section of the UI subtab demonstrates
 * how to use the BannerComponent.  This spec checks that
 * this the behavior of this section is correct including that:
 *   - The component is only visible when one of the buttons are clicked.
 *   - The component displays the correct message in the component.
 *   - The component is closed appropriately (timeout/click to dismiss)
 *   - That the element can be disabled and enabled programmatically.
 */
describe('Test the display of the error banner when network errors occur.', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('successful banner is displayed, without timeout', () => {
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')

        cy.get('[data-cy=trigger-success]')
            .click()
        
        cy.get('[data-cy=trigger-success]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('be.disabled')

        cy.get('[data-cy=alert-banner]')
            .should('be.visible')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'position')
            .should('include', 'sticky')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'top')
            .should('include', '63px')
        cy.get('[data-cy=alert-banner] > [data-cy=banner-message]')
            .should('be.visible')
            .should('have.text', 'Success! This is what a success banner looks like.')
        
        cy.get('[data-cy=alert-banner] > [data-cy=banner-close]')
            .should('be.visible')
            .click()
        
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')
        
        cy.get('[data-cy=trigger-success]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('not.be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('not.be.disabled')
        
    })

    it('error banner is displayed, without timeout', () => {
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')

        cy.get('[data-cy=trigger-error]')
            .click()
        
        cy.get('[data-cy=trigger-success]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('be.disabled')

        cy.get('[data-cy=alert-banner]')
            .should('be.visible')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'position')
            .should('include', 'sticky')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'top')
            .should('include', '63px')
        cy.get('[data-cy=alert-banner] > [data-cy=banner-message]')
            .should('be.visible')
            .should('have.text', 'Error! This is what an error banner looks like.')
        
        cy.get('[data-cy=alert-banner] > [data-cy=banner-close]')
            .should('be.visible')
            .click()
        
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')
        
        cy.get('[data-cy=trigger-success]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('not.be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('not.be.disabled')
        
    })

    it('message banner is displayed, without timeout', () => {
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')

        cy.get('[data-cy=trigger-message]')
            .click()
        
        cy.get('[data-cy=trigger-success]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('be.disabled')

        cy.get('[data-cy=alert-banner]')
            .should('be.visible')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'position')
            .should('include', 'sticky')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'top')
            .should('include', '63px')
        cy.get('[data-cy=alert-banner] > [data-cy=banner-message]')
            .should('be.visible')
            .should('have.text', 'Message! This is what a message banner looks like.')
        
        cy.get('[data-cy=alert-banner] > [data-cy=banner-close]')
            .should('be.visible')
            .click()
        
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')
        
        cy.get('[data-cy=trigger-success]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('not.be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('not.be.disabled')
        
    })

    it('successful banner is displayed, with timeout', () => {
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')

        cy.get('[data-cy=timeout-enable]')
            .click()
        cy.get('[data-cy=trigger-success]')
            .click()
        
        cy.get('[data-cy=trigger-success]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('be.disabled')

        cy.get('[data-cy=alert-banner]')
            .should('be.visible')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'position')
            .should('include', 'sticky')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'top')
            .should('include', '63px')
        cy.get('[data-cy=alert-banner] > [data-cy=banner-message]')
            .should('be.visible')
            .should('have.text', 'Success! This is what a success banner looks like.')
        
        cy.get('[data-cy=alert-banner] > [data-cy=banner-close]')
            .should('not.be.visible')

        cy.wait(5000)
        
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')
        
        cy.get('[data-cy=trigger-success]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('not.be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('not.be.disabled')
        
    })

    it('error banner is displayed, with timeout', () => {
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')

        cy.get('[data-cy=timeout-enable]')
            .click()
        cy.get('[data-cy=trigger-error]')
            .click()
        
        cy.get('[data-cy=trigger-success]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('be.disabled')

        cy.get('[data-cy=alert-banner]')
            .should('be.visible')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'position')
            .should('include', 'sticky')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'top')
            .should('include', '63px')
        cy.get('[data-cy=alert-banner] > [data-cy=banner-message]')
            .should('be.visible')
            .should('have.text', 'Error! This is what an error banner looks like.')
        
        cy.get('[data-cy=alert-banner] > [data-cy=banner-close]')
            .should('not.be.visible')
            
        cy.wait(5000)
        
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')
        
        cy.get('[data-cy=trigger-success]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('not.be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('not.be.disabled')
        
    })

    it('message banner is displayed, with timeout', () => {
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')

        cy.get('[data-cy=timeout-enable]')
            .click()
        cy.get('[data-cy=trigger-message]')
            .click()
        
        cy.get('[data-cy=trigger-success]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('be.disabled')

        cy.get('[data-cy=alert-banner]')
            .should('be.visible')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'position')
            .should('include', 'sticky')
        cy.get('[data-cy=alert-banner]')
            .should('have.css', 'top')
            .should('include', '63px')
        cy.get('[data-cy=alert-banner] > [data-cy=banner-message]')
            .should('be.visible')
            .should('have.text', 'Message! This is what a message banner looks like.')
        
        cy.get('[data-cy=alert-banner] > [data-cy=banner-close]')
            .should('not.be.visible')
            
        cy.wait(5000)
        
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')
        
        cy.get('[data-cy=trigger-success]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-error]')
            .should('not.be.disabled')
        cy.get('[data-cy=trigger-message]')
            .should('not.be.disabled')
        cy.get('[data-cy=timeout-enable]')
            .should('not.be.disabled')
        
    })

    it('enabling and disabling timeout button works.', () => {
        cy.get('[data-cy=alert-banner]')
            .should('not.visible')

        cy.get('[data-cy=timeout-disable]')
            .should('not.be.visible')
        cy.get('[data-cy=timeout-enable]')
            .should('be.visible')
            .click()
        cy.get('[data-cy=timeout-enable]')
            .should('not.be.visible')
        cy.get('[data-cy=timeout-disable]')
            .should('be.visible')
            .click()
            .should('not.be.visible')
        cy.get('[data-cy=timeout-enable]')
            .should('be.visible')
    })

})
