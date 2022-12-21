describe('Check visibility of FD2 Example tab', () => {

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
    cy.get('.nav-tabs').contains('FD2 Example').should('exist')
  })

  it('Login as manager1, should be visible.', () => {
    cy.login('manager1', 'farmdata2')
    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 Example').should('exist')
  })

  it('Login as worker1, should be visible.', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 Example').should('exist')
  })

  it('Login as guest, should not be visible.', () => {
    cy.login('guest', 'farmdata2')
    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 Example').should('not.exist')
  })
})
