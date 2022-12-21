/**
 * The DropdownWithAllComponent section of the UI subtab demonstrates
 * how to use the DropdownWithAllComponent.  This spec checks that
 * this the behavior of this section is correct including that:
 *   - The selected value is displayed and changed when a new item is chosen (via binding)
 *   - The selected value can be set programmatically (to Kale)
 *   - An item can be added programmatically (zucchini)
 *   - That the element can be disabled and enabled programmatically.
 */

describe('Test the the behavior of the DropdownWithAllComponent', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('Check that initial value is All is displayed.', () => {
        cy.get('[data-cy=picked-crop]').should('have.text','All')
    })

    it('Choose a new item from the list and check that displayed value is updated.', () => {
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
        .select("WATERMELLON")
        cy.get('[data-cy=picked-crop]').should('have.text','WATERMELLON')
    })

    it('Click Choose Kale button to programmatically set the selected item', () => {
        cy.get('[data-cy=choose-kale]').click()
        cy.get('[data-cy=picked-crop]').should('have.text','KALE')
    })

    it('Click Add Zucchini to programmatically add an item to the list.', () => {
        cy.get('[data-cy=add-zucchini]').click()
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
        .select("ZUCCHINI")
        cy.get('[data-cy=picked-crop]').should('have.text','ZUCCHINI')
    })

    it('Click the Disable button, and then the Enable button to programmatically disable/reenable element.', () => {
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('not.be.disabled')
        cy.get('[data-cy=btn-dropdown-disable]').click()
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('be.disabled')
        cy.get('[data-cy=btn-dropdown-enable]').click()
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('not.be.disabled')
    })
})