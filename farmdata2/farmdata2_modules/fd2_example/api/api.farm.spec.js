/**
 * The Get Farm Info section of the API subtab has two buttons,
 * one that uses an API call to fetch basic information about the farm
 * and the other that clears this information.  This spec tests that
 * those functions work properly.
 */

describe('Test getting and clearing the farm information.', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/api')
    })

    it('Click fetch and check that farm info is displayed.', () => {
        cy.get('[data-cy=farm-name]')
            .should('have.text','')

        cy.get('[data-cy=get-farm-info]').click()

        cy.get('[data-cy=farm-name]')
            .should('have.text','Sample Farm')
    })

    it('Click clear and ensure that the farm info is cleared.', () => {
        cy.get('[data-cy=get-farm-info]').click()
        cy.get('[data-cy=farm-name]')
            .should('have.text','Sample Farm')

        cy.get('[data-cy=clear-farm-info]').click()
        cy.get('[data-cy=farm-name]')
            .should('have.text','')
    })
})
