describe('Thes the fd2 javascript variables defined by the module', () => {

    context('check vars as the admin user', () => {
        
        beforeEach(() => {
            cy.login('admin', 'farmdata2')

            // Due to a Drupal issue an exception is thrown when logged in as admin.
            // This ignores that exception and continues with the test.
            // Note: There may be a drupal patch for this.
            //  https://www.drupal.org/project/drupal/issues/2997194
            cy.on('uncaught:exception', (err, runnable) => {
                return false
            })

            cy.visit('/farm/fd2-example/fd2vars')
        })

        it('check variables directly', () => {
            cy.window().its('fd2UserID').should('equal',1);
            cy.window().its('fd2UserName').should('equal','admin');
        })

        it('check user id value', () => {
            cy.get('[data-cy=user-id]')
                .should('have.text','1')
        })

        it('check user name value', () => {
            cy.get('[data-cy=user-name]')
                .should('have.text','admin')
        })
    })

    context('check as manager1', () => {

        beforeEach(() => {
            cy.login('manager1', 'farmdata2')
            cy.visit('/farm/fd2-example/fd2vars')
        })

        it('check variables directly', () => {
            cy.window().its('fd2UserID').should('equal',6);
            cy.window().its('fd2UserName').should('equal','manager1');
        })

        it('check user id value', () => {
            cy.get('[data-cy=user-id]')
                .should('have.text','6')
        })

        it('check user name value', () => {
            cy.get('[data-cy=user-name]')
                .should('have.text','manager1')
        })
    })

    context('check as worker1',() => {

        beforeEach(() => {
            cy.login('worker1', 'farmdata2')
            cy.visit('/farm/fd2-example/fd2vars')
        })

        it('check variables directly', () => {
            cy.window().its('fd2UserID').should('equal',8);
            cy.window().its('fd2UserName').should('equal','worker1');
        })

        it('check user id value', () => {
            cy.get('[data-cy=user-id]')
                .should('have.text','8')
        })

        it('check user name value', () => {
            cy.get('[data-cy=user-name]')
                .should('have.text','worker1')
        })
    })

    // Note: The FD2 Example tab is not shown when logged in as guest.
})