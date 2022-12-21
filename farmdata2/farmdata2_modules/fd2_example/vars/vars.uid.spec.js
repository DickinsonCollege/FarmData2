/**
 * The .module file defines some JS variables that are 
 * available in each subtab. This spec tests that the 
 * Vars subtabp are is able to display those variables.
 */
describe('Test that module can access the fd2 javascript variables defined by the module', () => {
    context('Test when logged in as the admin user', () => {
        
        beforeEach(() => {
            cy.login('admin', 'farmdata2')

            // Due to a Drupal issue an exception is thrown when logged in as admin.
            // This ignores that exception and continues with the test.
            // Note: There may be a drupal patch for this.
            //  https://www.drupal.org/project/drupal/issues/2997194
            cy.on('uncaught:exception', (err, runnable) => {
                return false
            })

            cy.visit('/farm/fd2-example/vars')
        })

        it('Check the values of the variables directly.', () => {
            // Note:  It would be better to use the username to user id map here
            // so that this will work if the sample data changes.  It was not used
            // to keep this example simple.  See the maps.spec.js file for an example
            // using a map.
            cy.window().its('fd2UserID').should('equal',1);
            cy.window().its('fd2UserName').should('equal','admin');
        })

        it('Check that the user id and user name are displayed.', () => {
            cy.get('[data-cy=user-id]')
                .should('have.text','1')
            cy.get('[data-cy=user-name]')
                .should('have.text','admin')
        })
    })

    context('Test when logged in as manager1', () => {

        beforeEach(() => {
            cy.login('manager1', 'farmdata2')
            cy.visit('/farm/fd2-example/vars')
        })

        it('Check the values of the variables directly.', () => {
            cy.window().its('fd2UserID').should('equal',3);
            cy.window().its('fd2UserName').should('equal','manager1');
        })

        it('Check that the user id and user name are displayed.', () => {
            cy.get('[data-cy=user-id]')
                .should('have.text','3')
            cy.get('[data-cy=user-name]')
                .should('have.text','manager1')
        })
    })

    context('Test when logged in as worker1',() => {

        beforeEach(() => {
            cy.login('worker1', 'farmdata2')
            cy.visit('/farm/fd2-example/vars')
        })

        it('Check the values of the variables directly.', () => {
            cy.window().its('fd2UserID').should('equal',5);
            cy.window().its('fd2UserName').should('equal','worker1');
        })

        it('Check that the user id and user name are displayed.', () => {
            cy.get('[data-cy=user-id]')
                .should('have.text','5')
            cy.get('[data-cy=user-name]')
                .should('have.text','worker1')
        })
    })
})