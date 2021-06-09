describe('Tests for the example sub-tab', () => {
  beforeEach(() => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-example/ex1')
  })

  it('Text field content is linked to header', () => {
    cy.get('[data-cy=comment-field]')
      .clear()
      .type('Hello Farm!')

    cy.get('[data-cy=comment]')
      .should('have.text','Hello Farm!')
  })
 
  it('API call for farm name works', () => {
    cy.get('[data-cy=get-name-button]')
      .click()

    cy.get('[data-cy=farm-name]')
      .should('have.text','Dickinson College Farm')
  })

  it.only('API call for fields works', () => {
    cy.get('[data-cy=singleOption]')
        .first().should('have.text', 'All')
        .next().should('have.text', 'ALF 1')
    
    cy.get('[data-cy=dropdown-input]')
      .type("All{enter}")
    cy.get('[data-cy=selected-field]')
      .should('have.text', "All")

    cy.get('[data-cy=dropdown-input]')
      .clear()
      .type("JASMINE-1{enter}")
    cy.get('[data-cy=selected-field]')
      .should('have.text', "JASMINE-1")
  })
})
