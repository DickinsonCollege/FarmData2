const dayjs = require('dayjs')

var FarmOSAPI = require('../resources/FarmOSAPI.js')
var getSessionToken = FarmOSAPI.getSessionToken
var getConfiguration = FarmOSAPI.getConfiguration
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
            cy.visit('/farm/fd2-example/vars')
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

    context('check configuration values', () => {
        beforeEach(() => {
            cy.login('worker1', 'farmdata2')
            .then(() => {
                // Using wrap to wait for the maps to load.
                cy.wrap(getSessionToken()).as('token')
                cy.wrap(getConfiguration()).as('getConfigMap')
            })
            cy.get('@token').should(function(token) {
                sessionToken = token
            })
            cy.get('@getConfigMap').should(function(map) {
                configMap = map.data
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'restws/session/token').as('sessiontok')
            cy.intercept('GET', '/fd2_config/1').as('config')
            
            cy.visit('/farm/fd2-example/vars')
            cy.wait(['@sessiontok', '@config'])
        })

        it("check values in the table after page is loaded", () => {
            var keys = Object.keys(configMap)
            // for loop to check the headings and data in the table
            for (let i = 0; i < keys.length; i++) {
                cy.get('[data-cy=table-headings]')
                    .should('contain.text', keys[i])
                cy.get('[data-cy=table-data]')
                    .should('contain', configMap[keys[i]])
            } 
        })

        // it("check values in the table after the values are updated", () => {
        //     // check initial values 
        //     var keys = Object.keys(configMap)
        //     for (let i = 0; i < keys.length; i++) {
        //         cy.get('[data-cy=table-headings]')
        //             .should('contain.text', keys[i])
        //         cy.get('[data-cy=table-data]')
        //             .should('contain', configMap[keys[i]])
        //     } 
        //     // update the config object by clicking the button
        //     cy.intercept('PUT', 'fd2_config/1').as('updateConfig')
        //     cy.get('[data-cy=update-labor-btn]')
        //         .click()

        //     // set up intercept here before calling getConfiguration()
        //     cy.intercept('GET', '/fd2_config/1').as('newconfig')
        //     cy.wait('@updateConfig')
        //     .then(interception => {
        //         // read the response
        //         expect(interception.response.statusCode).to.eq(200)
        //         cy.wrap(getConfiguration()).as('getNewConfigMap')
        //     })
        //     // read the config map again to verify update
        //     cy.get('@getNewConfigMap').should(function(map) {
        //         configMap = map.data
        //     })
        //     cy.wait('@newconfig')
        //     .then(() => {
        //         var newkeys = Object.keys(configMap)
        //         console.log(configMap)
        //         console.log(newkeys)
        //         for (let i = 0; i < newkeys.length; i++) {
        //             cy.get('[data-cy=table-headings]')
        //                 .should('contain.text', newkeys[i])
        //             cy.get('[data-cy=table-data]')
        //                 .should('contain', configMap[keys[i]])
        //         }
        //     })
    //     })
    })
    // Note: The FD2 Example tab is not shown when logged in as guest.
})