it('Info tab of the field kit exists and has content', () => {
  cy.login('manager1', 'farmdata2')
  cy.visit('/farm/fd2-field-kit')

  cy.get('[data-cy=header]').should('have.text', 'FarmData2 Field Kit')
  cy.get('[data-cy=info]').should('have.length.greaterThan', 1)
})
