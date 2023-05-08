/**
 * This file contains Cypress tests for the FieldKit tabbed interface on the fd2_farmdata2 website.
 * The tests check the following:
 *
 * - The FieldKit tab contains sub-tabs for "Info" and "Seeding Input."
 * - The order of the tabs is "Info" and then "Seeding Input."
 * - There are the correct number of sub-tabs (2 at this time).
 *
 * These tests are intended to ensure that the FieldKit tabbed interface is implemented correctly
 * and that it meets the requirements specified by the design.
 */

describe('Test for FieldKit Sub-Tabs', () => {

  beforeEach(() => {
    cy.login('manager1', 'farmdata2')
    cy.visit('/farm/fd2-field-kit')
  })

  //issue #200, sub-task 1
  it('Verify that FieldKit tab contains sub-tabs for "Info" and "Seeding Input"', () => {
    cy.get('.pagination-sm').contains('Info').should('exist')
    cy.get('.pagination-sm').contains('Seeding Input').should('exist')
  })

  //issue #200, sub-task 2
  it('checks the order of the tabs is “Info” and then “Seeding Input.”', () => {
    cy.get('ul.pagination-sm')
      .find('li')
      .filter(':contains("Info")')
      .next()
      .should('contain', 'Seeding Input');
  })

  //issue #200, sub-task 3
  it('checks the correct number of sub-tabs', () => {
    cy.get('ul.pagination-sm')
      .find('li')
      .should('have.length', 2)
  })

})