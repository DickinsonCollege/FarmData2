/**
 * The FD2 Example tab has an Info subtab that describes the purpose
 * of the module.  This spec checks that the Info subtab has some
 * appropriate information on it.
 */

describe('Test to make sure the info tab has some content.', () => {

  it('Visit the info subtab and check its contents.', () => {
    cy.login('manager1', 'farmdata2')
    cy.visit('/farm/fd2-example')

    // Check that the header has the right text.
    cy.get('[data-cy=header]').should('have.text', 'FarmData2 Example Module')

    // Check that there are at least two paragraphs of information.
    cy.get('p').should('have.length.greaterThan', 1)

    // Check that first paragraph likely describes the sample module.
    cy.get('[data-cy=intro]').should('contain.text', 'sample module')
    cy.get('[data-cy=intro]').invoke('text').should('have.length.greaterThan',25)

    // Check that there is also some content in the second paragraph.
    cy.get('[data-cy=detail').invoke('text').should('have.length.greaterThan',25)
  })

})