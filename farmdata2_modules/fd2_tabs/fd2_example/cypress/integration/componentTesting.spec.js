describe('Field and Crop Dropdowns', () => {
  beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/cropAndFieldPickersTesting')
  })
  context('Crop Dropdown', () => {
    it('accepts input from search bar', () => {
        cy.get('[data-cy=crop-picker-input]')
            .type('lettuce')
            .should('have.value', 'lettuce')
    })

    //create test to make sure that all crops are showing up in the drop-down menu before anything is typed in the search bar
    //API request in the spec file???

    it('displays only crops sorted out by the search term', () => {
        cy.get('[data-cy=crop-picker-input]')
            .type('lettuce')
            .should('have.value', 'lettuce')
        cy.get('[data-cy=crop-picker-dropdown]')
            .should('have.value', ['placeholder'])
    })
  })
})
