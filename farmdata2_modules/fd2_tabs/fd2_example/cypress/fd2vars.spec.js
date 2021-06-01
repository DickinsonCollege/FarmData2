describe('Check the JS vars defined by module', () => {

  it('Works for admin user', () => {
    cy.login('admin', 'farmdata2')

    // Due to a Drupal issue an exception is thrown when logged in as admin.
    // This ignores that exception and continues with the test.
    // Note: There may be a drupal patch for this.
    //  https://www.drupal.org/project/drupal/issues/2997194
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })

    cy.visit('/farm/fd2-example')
    cy.window().its('fd2UserID').should('equal',1);
    cy.window().its('fd2UserName').should('equal','admin');
  })

  it('Works for manager', () => {
    cy.login('manager1', 'farmdata2')

    cy.visit('/farm/fd2-example')
    cy.window().its('fd2UserID').should('equal',3);
    cy.window().its('fd2UserName').should('equal','manager1');
  })

  it('Works for worker', () => {
    cy.login('worker1', 'farmdata2')

    cy.visit('/farm/fd2-example')
    cy.window().its('fd2UserID').should('equal',5);
    cy.window().its('fd2UserName').should('equal','worker1');
  })
})