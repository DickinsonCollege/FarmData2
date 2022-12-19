const dayjs = require('dayjs')

describe('Test the fd2 javascript variables defined by the module', () => {
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

            cy.visit('/farm/fd2-example/vars')
        })

        it('check variables directly', () => {
            // Note:  It would be better to use the username to user id map here
            // so that this will work if the sample data changes.  It was not used
            // to keep this example simple.  See the maps.spec.js file for an example
            // using a map.
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
            cy.visit('/farm/fd2-example/vars')
        })

        it('check variables directly', () => {
            cy.window().its('fd2UserID').should('equal',3);
            cy.window().its('fd2UserName').should('equal','manager1');
        })

        it('check user id value', () => {
            cy.get('[data-cy=user-id]')
                .should('have.text','3')
        })

        it('check user name value', () => {
            cy.get('[data-cy=user-name]')
                .should('have.text','manager1')
        })
    })

    context('check as worker1',() => {

        beforeEach(() => {
            cy.login('worker1', 'farmdata2')
            cy.visit('/farm/fd2-example/vars')
        })

        it('check variables directly', () => {
            cy.window().its('fd2UserID').should('equal',5);
            cy.window().its('fd2UserName').should('equal','worker1');
        })

        it('check user id value', () => {
            cy.get('[data-cy=user-id]')
                .should('have.text','5')
        })

        it('check user name value', () => {
            cy.get('[data-cy=user-name]')
                .should('have.text','worker1')
        })
    })
})