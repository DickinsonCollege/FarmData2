/**
 * This spec tests the behavior of the buttons in the
 * FieldSets & Buttons section of the UI subtab.
 */

describe('Test the fieldset and buttons', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('check initial button state', () => {
        cy.get('[data-cy=left-button]')
            .should('not.be.disabled')
        cy.get('[data-cy=right-button]')
            .should('be.disabled')
    })

    it('clicking buttons toggles state', () => {
        cy.get('[data-cy=left-button]')
            .click()
        cy.get('[data-cy=left-button]')
            .should('be.disabled')
        cy.get('[data-cy=right-button]')
            .should('not.be.disabled')

        cy.get('[data-cy=right-button]')
            .click()
        cy.get('[data-cy=left-button]')
            .should('not.be.disabled')
        cy.get('[data-cy=right-button]')
            .should('be.disabled')    
    })
})