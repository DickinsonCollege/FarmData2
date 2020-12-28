describe('Tests for the Example Field Kit Form', () => {

  it('Text field content is linked to header', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-field-kit/example')

    cy.get('[data-cy=header-field]').clear().type('Hello Farm!')
    
    cy.get('[data-cy=header]').should('have.text','Hello Farm!')
  })

  it('API call for farm name works', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-field-kit/example')

    cy.get('[data-cy=get-name-button]').click()

    cy.get('[data-cy=farm-name]').should('have.text','Dickinson College Farm')
  })

  it('API call for fields works', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-field-kit/example')

    cy.get('[data-cy=get-fields-button]').click()

    cy.get('[data-cy=field-list]').children().should('have.length', 15)
    cy.get('[data-cy=field-list]').children().eq(0).should('have.text', 'SQ 5')
    cy.get('[data-cy=field-list]').children().eq(7).should('have.text', 'Q')
    cy.get('[data-cy=field-list]').children().eq(14).should('have.text', 'Chuau Greenhouse')
  })
})
