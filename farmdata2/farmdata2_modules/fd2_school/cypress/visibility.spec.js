/**
 * farmOS displays the FarmData2 tabs across the main menu 
 * in the center of the page.  This spec checks that the
 * FD2 School tab is visible for the admin, manager and worker
 * users, and that it is not visible for the guest user.
 */

describe('Check visibility of the FD2 School tab', () => {

  it('Login as admin user, should be visible.', () => {
    cy.login('admin', 'farmdata2')

    // Due to a Drupal issue an exception is thrown when logged in as admin.
    // This ignores that exception and continues with the test.
    // Note: There may be a drupal patch for this.
    //  https://www.drupal.org/project/drupal/issues/2997194
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })

    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 School').should('exist')
  })

  it('Login as manager1, should be visible.', () => {
    cy.login('manager1', 'farmdata2')
    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 School').should('exist')
  })

  it('Login as worker1, should be visible.', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 School').should('exist')
  })

  it('Login as guest, should not be visible.', () => {
    cy.login('guest', 'farmdata2')
    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 School').should('not.exist')
  })
})
