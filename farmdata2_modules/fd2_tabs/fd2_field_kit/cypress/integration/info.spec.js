it('Info tab of the field kit exists and has content', () => {
  cy.login('manager1', 'farmdata2')
  cy.visit('/farm/fd2-field-kit')

  // Check that the header has the right text.
  cy.get('h3').should('have.text', 'FarmData2 Field Kit')

  // Check that there are at least two paragraphs of information.
  cy.get('p').should('have.length.greaterThan', 1)

  // Check that first paragraph likely describes the sample module.
  cy.get('p').eq(0).should('contain.text', 'Field Kit')
  cy.get('p').eq(0).invoke('text').should('have.length.greaterThan',25)

  // Check that there is also some content in the second paragraph.
  cy.get('p').eq(1).invoke('text').should('have.length.greaterThan',25)
})
