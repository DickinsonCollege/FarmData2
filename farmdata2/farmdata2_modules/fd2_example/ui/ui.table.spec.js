/**
 * The CustomTableComponent section of the UI subtab illustrates
 * some of the ways this component can be used.  This spec tests
 * that:
 *   - The table properly displays its data
 *   - That a selected row can be deleted.
 *   - That a row can be edited.
 *   - That a column can be shown or hidden
 *   - That a row of data can be added.
 *   - That the custom button (*) works (clones selected rows)
 */

describe('Test the behavior of the CustomTableComponent', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('Test that table displays its data properly.', () => {
        cy.get('[data-cy=r0-ID]')
            .should('have.text', '1')
        cy.get('[data-cy=r0-Item]')
            .should('have.text', 'Shirt')
        cy.get('[data-cy=r0-Color]')
            .should('have.text', 'Green')
        cy.get('[data-cy=r0-Count]')
            .should('have.text', '5')
        cy.get('[data-cy=r0-Purchased-input]')
            .should('be.checked')
        cy.get('[data-cy=edit-row-id]')
            .should('have.text','')
    })

    it('Select the first item in the table and delete it.', () => {
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

    it('Edit the first row in the table.', () => {
        cy.get('[data-cy=r0-edit-button')
            .click()

        cy.get('[data-cy=r0-Item-input')
            .clear()
            .type('Tee Shirts')
        
        cy.get('[data-cy=edit-row-id]')
            .should('have.text','1')

        cy.get('[data-cy=r0-save-button]')
            .click()
        
        cy.get('[data-cy=r0-Item]')
            .should('have.text','Tee Shirts')
        
        cy.get('[data-cy=edit-row-id]')
            .should('have.text','')
    })

    it('Click the Add Row button and ensure that the new row was added.', () => {
        cy.get('[data-cy=add-data')
            .click()
        
        cy.get('[data-cy=r3-ID]')
            .should('have.text', '12')
    })

    it('Click Show/Hide Column and ensure that the size column is shown/hidden', () => {
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