describe('Tests for the example sub-tab', () => {

  it('Text field content is linked to header', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-example/ex1')

    cy.get('[data-cy=comment-field]').clear().type('Hello Farm!')

    cy.get('[data-cy=comment]').should('have.text','Hello Farm!')
  })

  it('API call for farm name works', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-example/ex1')

    cy.get('[data-cy=get-name-button]').click()

    cy.get('[data-cy=farm-name]').should('have.text','Dickinson College Farm')
  })

  it('API call for fields works', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-example/ex1')

    cy.get('[data-cy=get-field-dropdown]').children().eq(1).select("All")
    cy.get('[data-cy=get-selected-field]').should('have.text', "All")

    cy.get('[data-cy=get-field-dropdown]').children().eq(1).select("JASMINE-1")
    cy.get('[data-cy=get-selected-field]').should('have.text', "JASMINE-1")
  })
})
