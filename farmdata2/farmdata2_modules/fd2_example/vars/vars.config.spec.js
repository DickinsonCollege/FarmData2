/**
 * The vars.html page loads and displays the contents of 
 * configuration saved by the fd2_config module.  This spec
 * verifies that the settings in the config are displayed in 
 * the vars page.
 */

var FarmOSAPI = require('../../resources/FarmOSAPI.js')

var getSessionToken = FarmOSAPI.getSessionToken
var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration

describe('Test that the page displays the values saved by the config module.', () => {

    let sessionToken = null
    let configMap = null

    beforeEach(() => {
        cy.login('worker1', 'farmdata2')
        .then(() => {
            // Get the session token so that the config can be changed by the tests.
            cy.wrap(getSessionToken()).as('token')
            // Get the current configuration so that the display can be checked.
            cy.wrap(getConfiguration()).as('getConfigMap')
        })

        // Wait for the API calls that get the session token and configuration to 
        // return before continuing with the tests.
        cy.get('@token').then(function(token) {
            sessionToken = token
        })
        cy.get('@getConfigMap').then(function(map) {
            configMap = map.data
        })
        
        cy.visit('/farm/fd2-example/vars')
        // The Var's page uses the configuration object so we 
        // wait here to be sure the page has that information
        // before continuing.
        cy.waitForPage()
    })

    it("Check the configuration values in the table when the page is loaded.", () => {
        let keys = Object.keys(configMap)

        // Loop through the map we loaded in the test and compare each
        // key and value to those displayed by the page.
        for (let i = 0; i < keys.length; i++) {
            cy.get('[data-cy='+i+'configName]')
                .should('have.text', keys[i])
            cy.get('[data-cy='+i+'data]')
                .should('have.text', configMap[keys[i]])
        } 
    })
})