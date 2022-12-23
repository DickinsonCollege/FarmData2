/**
 * The FD2 School .module file defines some variables that are made
 * available to the scripts in the .html pages.  This spec tests
 * that those variables are accessible in the page for each of
 * the users.
 */
describe('Check the JS vars defined by the FD2 School module', () => {

  it('Log in as admin user and check tha vars exist.', () => {
    cy.login('admin', 'farmdata2')

    // Due to a Drupal issue an exception is thrown when logged in as admin.
    // This ignores that exception and continues with the test.
    // Note: There may be a drupal patch for this.
    //  https://www.drupal.org/project/drupal/issues/2997194
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })

    cy.visit('/farm/fd2-barn-kit')
    cy.window().its('fd2UserID').should('equal',1);
    cy.window().its('fd2UserName').should('equal','admin');
  })

  it('Log in as manager1 and check tha vars exist.', () => {
    cy.login('manager1', 'farmdata2')

    cy.visit('/farm/fd2-barn-kit')
    cy.window().its('fd2UserID').should('equal',3);
    cy.window().its('fd2UserName').should('equal','manager1');
  })

  it('Log in as worker1 and check tha vars exist.', () => {
    cy.login('worker1', 'farmdata2')

    cy.visit('/farm/fd2-barn-kit')
    cy.window().its('fd2UserID').should('equal',5);
    cy.window().its('fd2UserName').should('equal','worker1');
  })

  // Currently guest users cannot see any FD2 tabs so no check for them.
})
