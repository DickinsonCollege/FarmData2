describe('Tests for the Example Field Kit Form', () => {

  it('Field Linked To Header', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-field-kit/example')

    cy.get('[data-cy=header-field]').clear().type('Hello Farm!')
    cy.get('[data-cy=header]').should('have.text','Hello Farm!')
  })

  
})
