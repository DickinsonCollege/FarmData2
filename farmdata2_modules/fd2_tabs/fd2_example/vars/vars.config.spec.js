var FarmOSAPI = require('../../resources/FarmOSAPI.js')

var getSessionToken = FarmOSAPI.getSessionToken
var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration

describe('Test the values saved by the config module.', () => {

    let sessionToken = null
    let configMap = null

    beforeEach(() => {
        cy.login('worker1', 'farmdata2')
        .then(() => {
            // Using wrap to wait for the maps to load.
            cy.wrap(getSessionToken()).as('token')
            cy.wrap(getConfiguration()).as('getConfigMap')
        })
        cy.get('@token').then(function(token) {
            sessionToken = token
        })
        cy.get('@getConfigMap').then(function(map) {
            configMap = map.data
        })
        
        // Setting up wait for the request in the created() to complete.
        //cy.intercept('GET', 'restws/session/token').as('sessiontok')
        cy.intercept('GET', '/fd2_config/1').as('config')
        
        cy.visit('/farm/fd2-example/vars')
        cy.wait('@config')
    })

    it("check values in the table when the page is loaded", () => {
        let keys = Object.keys(configMap)
        // for loop to check the headings and data in the table
        for (let i = 0; i < keys.length; i++) {
            cy.get('[data-cy='+i+'configName]')
                .should('have.text', keys[i])
            cy.get('[data-cy='+i+'data]')
                .should('have.text', configMap[keys[i]])
        } 
    })

    it("check values in the table after the values are updated", () => {
        // check initial values 
        let keys = Object.keys(configMap)
        
        for (let i = 0; i < keys.length; i++) {
            cy.get('[data-cy='+i+'configName]')
                .should('have.text', keys[i])
            cy.get('[data-cy='+i+'data]')
                .should('have.text', configMap[keys[i]])
        } 
        
        // Change the config object
        let newConfigObj = { id:1, labor: "Optional"}
        cy.intercept('GET', '/fd2_config/1').as('newconfig')
        cy.wrap(setConfiguration(newConfigObj, sessionToken)).as(`resetConfig`)

        // read the config map again to verify update
        cy.get(`@resetConfig`)
        .then(() => {
            cy.wrap(getConfiguration()).as('getNewConfigMap')
        })
        
        let newConfigMap = null
        cy.get('@getNewConfigMap')
        .then(function(map) {
            newConfigMap = map.data
        })

        // Reload the page and check if the config was updated.
        cy.reload()
        .then(() => {
            let newkeys = Object.keys(newConfigMap)
            for (let i = 0; i < newkeys.length; i++) {
                cy.get('[data-cy='+i+'configName]')
                    .should('have.text', newkeys[i])
                cy.get('[data-cy='+i+'data]')
                    .should('have.text', newConfigMap[newkeys[i]])
            } 
        })
        .then(() => {
            // Set the config back to what it was initially.
            setConfiguration(configMap, sessionToken)
        })
    })
})