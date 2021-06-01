describe('Check visibility of FD2 Example tab', () => {

  it('Visible to admin user', () => {
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

  it('Visible to manager', () => {
    cy.login('manager1', 'farmdata2')
    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 Example').should('exist')
  })

  it('Visible to worker', () => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 Example').should('exist')
  })

  it('Not visible to guest user', () => {
    cy.login('guest', 'farmdata2')
    cy.visit('/farm')
    cy.get('.nav-tabs').contains('FD2 Example').should('not.exist')
  })
})
