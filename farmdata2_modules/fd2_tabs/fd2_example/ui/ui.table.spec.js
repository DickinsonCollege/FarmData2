/**
 * This spec tests the behavior of the CustomTableComponent
 * that appears on the UI subtab.
 */

describe('Test the table component', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('table data is loaded', () => {
        cy.get('[data-cy=r0-ID]')
            .should('have.text', '1')
        cy.get('[data-cy=r0-Item]')
            .should('have.text', 'Shirt')
        cy.get('[data-cy=r0-Color]')
            .should('have.text', 'Green')
        cy.get('[data-cy=r0-Count]')
            .should('have.text', '5')
        cy.get('[data-cy=r0-boolean-input]')
            .should('be.checked')
    })

    it('table row is deleted', () => {
        cy.get('[data-cy=r1-ID]')
            .should('have.text', '5')

        cy.get('[data-cy=delete-button')
            .should('be.disabled')
        
        cy.get('[data-cy=r0-cbuttonCheckbox')
            .check()

            cy.get('[data-cy=delete-button')
            .should('be.enabled')
            .click()
        
        cy.get('[data-cy=r1-ID]')
            .should('have.text', '9')
    })

    it('table row is edited', () => {
        cy.get('[data-cy=r0-edit-button')
            .click()

        cy.get('[data-cy=r0-text-input')
            .clear()
            .type('Tee Shirts')
        
        cy.get('[data-cy=r0-save-button]')
            .click()
        
        cy.get('[data-cy=r0-Item]')
            .should('have.text','Tee Shirts')
    })

    it('table row is added', () => {
        cy.get('[data-cy=add-data')
            .click()
        
        cy.get('[data-cy=r3-ID]')
            .should('have.text', '12')
    })

    it('clicking show column reveals hidden column', () => {
        cy.get('[data-cy=table-headers]').children()
            .should('not.contain', 'Size')
        cy.get('[data-cy=show-column')
            .click()
        cy.get('[data-cy=table-headers]').children()
            .should('contain', 'Size')
        cy.get('[data-cy=hide-column')
            .click()
        cy.get('[data-cy=table-headers]').children()
            .should('not.contain', 'Size')
    })
})