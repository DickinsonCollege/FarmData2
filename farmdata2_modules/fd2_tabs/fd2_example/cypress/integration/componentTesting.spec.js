describe('Field and Crop Dropdowns', () => {
  beforeEach(() => {
          //cy.login('manager1', 'farmdata2')
          cy.visit('/farm/fd2-example/componentTesting')
  })
  context('Crop Dropdown', () => {
    it('accepts input from search bar', () => {
      cy.get('crop-picker-element')
        .type('lettuce')
        .should('have.value', 'lettuce')
    })
  })
})
