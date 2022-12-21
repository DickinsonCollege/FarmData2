/**
 * This DateSelectionComponent section of the UI subtab demonstrates
 * how the comonent can be used.  It displays the selected date and
 * the click events that happen. There is a button that can enable and
 * disable the element as well. This spec tests those functionalities.
 */

describe('Test the DateSelectionComponent behavior.', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('Click in the component and check the number of click events.', () => {
        cy.get('[data-cy=date-clicks]').should('have.text','0')

        // Need to get the element with data-cy=date-select that is
        // inside of the component with data-cy=date-picker. 
        cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()

        cy.get('[data-cy=date-clicks]').should('have.text','1')
        cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()
        cy.get('[data-cy=date-clicks]').should('have.text', '2')
        cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()
        cy.get('[data-cy=date-clicks]').should('have.text', '3')
    })

    it('Change the selected date and check that value displayed matches.', () => {
        cy.get('[data-cy=date-picker] > [data-cy=date-select]')
        .type('2021-01-22')  // note the format for typing.
        .blur() // makes component inactive which triggers the date-change event.

        cy.get('[data-cy=date-chosen]').should('have.text', '2021-01-22')
    })

    it('Click the Disable/Enable buttons and to disable and enable the component.', () => {
        cy.get('[data-cy=date-select]').should('not.be.disabled')
        cy.get('[data-cy=btn-date-disable]').click()
        cy.get('[data-cy=date-select]').should('be.disabled')
        cy.get('[data-cy=btn-date-enable]').click()
        cy.get('[data-cy=date-select]').should('not.be.disabled')
    })
})