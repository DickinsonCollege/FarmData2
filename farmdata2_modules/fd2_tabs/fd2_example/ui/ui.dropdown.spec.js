describe('Test the the dropdown with all component', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('check initial value', () => {
        cy.get('[data-cy=picked-crop]').should('have.text','All')
    })

    it('check item selection event handler', () => {
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
        .select("WATERMELLON")
        cy.get('[data-cy=picked-crop]').should('have.text','WATERMELLON')
    })

    it('programatically set selected item', () => {
        cy.get('[data-cy=choose-kale]').click()
        cy.get('[data-cy=picked-crop]').should('have.text','KALE')
    })

    it('modify the list of choices', () => {
        cy.get('[data-cy=add-zucchini]').click()
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
        .select("ZUCCHINI")
        cy.get('[data-cy=picked-crop]').should('have.text','ZUCCHINI')
    })

    it('disable and enable the dropdown', () => {
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('not.be.disabled')
        cy.get('[data-cy=btn-dropdown-disable]').click()
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('be.disabled')
        cy.get('[data-cy=btn-dropdown-enable]').click()
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('not.be.disabled')
    })
})