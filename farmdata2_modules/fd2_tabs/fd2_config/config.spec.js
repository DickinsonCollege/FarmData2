const dayjs = require('dayjs')

var FarmOSAPI = require('../resources/FarmOSAPI.js')

var getSessionToken = FarmOSAPI.getSessionToken
var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration

describe('Test the configuration page', () =>{
    let sessionToken = null
    let configMap = null
    // save the current configuration
    let defaultLaborConfig = null
    // set the labor configuration to required by default for testing
    let testConfig = { id: "1", labor: 'Required' }

    context('Test the labor configuration', () =>{
        beforeEach(() =>{
            cy.login('manager1', 'farmdata2')
            .then(() => {
                // Using wrap to wait for the asynchronus API request.
                    cy.wrap(getSessionToken()).as('token')
                    cy.wrap(getConfiguration()).as('configData')

            })
            // Wait here for the maps in the tests.
            cy.get('@token').should(function(token) {
                sessionToken = token
            })
            cy.get('@configData').should(function(map) {
                configMap = map.data
                defaultLaborConfig = configMap.labor
            })
            .then(() => {
                cy.wrap(setConfiguration(testConfig, sessionToken)).as('updateConfig')
            })
            cy.get('@updateConfig') 
            .then(() => {
                cy.wrap(getConfiguration()).as('getNewConfigMap')
            })          
            // set up intercept for setting up the configuration
            cy.get('@getNewConfigMap').should(function(map) {
                configMap = map.data
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'restws/session/token').as('sessiontok')
            cy.intercept('GET', '/fd2_config/1').as('getConfigMap')       
                     
            cy.visit('/farm/fd2-config')

            cy.wait(['@sessiontok', '@getConfigMap'])
        })
        
        it('test if default labor configuration is correctly loaded to the dropdown', () => {
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input] option:selected')
                .should('have.text', "Required")
        })

        it('test if the labor configuration dropdown has correct options', () => {
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .children()
                .first()
                .should('have.text', "Required")
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .last()  
                .should('have.value', 'Hidden')
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', 3)
        })

        it('test save button (disabled by default -> enabled when changed)', () => {
            cy.get('[data-cy=save-button]')
                .should('be.disabled')
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .select('Optional')
            cy.get('[data-cy=save-button]')
                .should('not.be.disabled')   
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .select('Required')
            cy.get('[data-cy=save-button]')
                .should('be.disabled')
        })

        it('test alert success message', () => {
            cy.get('[data-cy=alert-success')
                .should('not.be.visible')
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .select('Optional')
            cy.get('[data-cy=save-button]')
                .click()
            cy.get('[data-cy=alert-success')
                .should('be.visible')     
            cy.wait(3000)
            cy.get('[data-cy=alert-success')
                .should('not.be.visible')
        })

        it('test if save button updates the JSON', () => {
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .select('Optional')
            cy.intercept('PUT', 'fd2_config/1').as('changeConfig')
            cy.get('[data-cy=save-button]')
                .click()
            cy.wait('@changeConfig')
            .then(interception => {
                // read the response
                expect(interception.response.statusCode).to.eq(200)
                cy.intercept('GET', '/fd2_config/1').as('newconfig')
                cy.wrap(getConfiguration()).as('getChangedConfigMap')
            })
            .then(interception => {
                // read the response
                expect(interception.status).to.eq(200)
                expect(interception.data.labor).to.eq("Optional")
            })
        })
    })

    context('API failure tests', () => {
        beforeEach(() => {
            cy.login('manager1', 'farmdata2')

        })

        it('fail the session token API: outside of 2xx error code', () => {
            cy.intercept('GET', 'restws/session/token', { statusCode: 500 }).as('failedSessionTok')

            cy.visit('/farm/fd2-config')
            cy.wait('@failedSessionTok')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.visible')
                }) 
        })

        it('fail the session token API: network error', () => {
            cy.intercept('GET', 'restws/session/token', { forceNetworkError: true }).as('failedSessionTok')

            cy.visit('/farm/fd2-config')
            cy.wait('@failedSessionTok')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.visible')
                }) 
        })

        it('fail the get config API Request: outside of 2xx error code', () => {
            cy.intercept('GET', '/fd2_config/1', { statusCode: 500 }).as('failedGetConfig')

            cy.visit('/farm/fd2-config')
            cy.wait('@failedGetConfig')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.visible')
                }) 
        })

        it('fail the get config API Request: network error', () => {
            cy.intercept('GET', '/fd2_config/1', { forceNetworkError: true }).as('failedGetConfig')

            cy.visit('/farm/fd2-config')
            cy.wait('@failedGetConfig')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.visible')
                }) 
        })

        it('fail the set config API Request when save is clicked: outside of 2xx error code', () => {
            cy.visit('/farm/fd2-config')
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .select('Hidden')
            cy.intercept('PUT', 'fd2_config/1', { statusCode: 500 }).as('failedChangeConfig')
            cy.get('[data-cy=save-button]')
                .click()
            cy.wait('@failedChangeConfig') // wait for the log creation
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.visible')
                })
        })

        it('fail the set config API Request when save is clicked: network error', () => {
            cy.visit('/farm/fd2-config')
            cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
                .select('Hidden')
            cy.intercept('PUT', 'fd2_config/1', { forceNetworkError: true }).as('failedChangeConfig')
            cy.get('[data-cy=save-button]')
                .click()
            cy.wait('@failedChangeConfig') // wait for the log creation
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.visible')
                })
        })
    })
})