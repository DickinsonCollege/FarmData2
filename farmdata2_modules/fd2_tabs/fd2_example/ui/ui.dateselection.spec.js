/**
 * This spec tests the behavior of the DateSelection component
 * on the UI subtab.
 */

describe('Test the check the date selection component', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('test click event handler', () => {
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

    it('test date change event handler', () => {
        cy.get('[data-cy=date-picker] > [data-cy=date-select]')
        .type('2021-01-22')  // note the format for typing.
        .blur() // makes component inactive which triggers the date-change event.

        cy.get('[data-cy=date-chosen]').should('have.text', '2021-01-22')
    })

    it('disable and enable the date selection component', () => {
        cy.get('[data-cy=date-select]').should('not.be.disabled')
        cy.get('[data-cy=btn-date-disable]').click()
        cy.get('[data-cy=date-select]').should('be.disabled')
        cy.get('[data-cy=btn-date-enable]').click()
        cy.get('[data-cy=date-select]').should('not.be.disabled')
    })
})