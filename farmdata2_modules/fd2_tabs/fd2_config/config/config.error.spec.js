var FarmOSAPI = require('../../resources/FarmOSAPI.js')

var getSessionToken = FarmOSAPI.getSessionToken
var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration

describe('Test the configuration page', () => {

    context('Tests for errors when page loads.', () => {

        beforeEach(() =>{
            cy.login('manager1', 'farmdata2')
        })

        it('Network failure getting the session token', () => {
            cy.intercept('GET', 'restws/session/token', { forceNetworkError: true }).as('failedSessionTok')

            cy.visit('/farm/fd2-config')
            cy.wait('@failedSessionTok')
                .then(() => {
                    cy.get('[data-cy=alert-container]')
                    cy.window().its('scrollY').should('equal', 0)   
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.be.visible')
                }) 
        })

        it('Network failure getting config in the page', () => {
            cy.intercept('GET', '/fd2_config/1', { forceNetworkError: true }).as('failedGetConfig')

            cy.visit('/farm/fd2-config')
            cy.wait('@failedGetConfig')
                .then(() => {
                    cy.get('[data-cy=alert-container]')
                    cy.window().its('scrollY').should('equal', 0)    
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.be.visible')
                }) 
        })
    })

    context('Tests for errors when save button is clicked', () => {
        let sessionToken = null
    
        // Current configuration
        let curConfig = null
        // set the labor configuration to required by default for testing
        let testConfig = { id: "1", labor: 'Required' }

        beforeEach(() =>{
            cy.login('manager1', 'farmdata2')
            .then(() => {
                // get the session token and the current config.
                cy.wrap(getSessionToken()).as('getToken')
                cy.wrap(getConfiguration()).as('getCurConfig')
            })

            cy.get('@getToken')
            .then(function(token) {
                sessionToken = token
            })

            cy.get('@getCurConfig')
            .then(function(map) {
                curConfig = map.data
                // setup a known config for the tests.
                cy.wrap(setConfiguration(testConfig, sessionToken)).as('setTestConfig')
            })

            // wait for test config to be saved.
            cy.get('@setTestConfig') 
                
            cy.visit('/farm/fd2-config')
            cy.waitForPage()
        })

        afterEach(() => {
            // reset the configuration to what it was before the test.
            cy.wrap(setConfiguration(curConfig, sessionToken)).as('resetConfig')
            cy.get('@resetConfig')
        })

        it ('Network failure when save is clicked', () => {
            // change the setting so it can be saved.
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .select('Hidden')

            // click the save button.
            // Note: { forceNetworkError: true } did not work here!
            //       seems to be a Cypress bug with using times with forceNetworkError.
            cy.intercept({ method: 'PUT', 
                           url: 'fd2_config/1', 
                           times : 1
                        },
                        { statusCode:500 }).as('failedChangeConfig')
            cy.get('[data-cy=save-button]')
                .click()

            // Wait on the API call to complete (due to error)
            cy.wait('@failedChangeConfig')
                .then(() => {
                    cy.get('[data-cy=alert-container]')
                    cy.window().its('scrollY').should('equal', 0)    
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.be.visible')
                })  
        })
    })
})