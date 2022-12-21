var FarmOSAPI = require('../../resources/FarmOSAPI.js')

var getSessionToken = FarmOSAPI.getSessionToken
var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration

describe('Test changing and saving the labor configuration', () => {
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

    it('Check that test labor configuration was set', () => {
        cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input] option:selected')
            .should('have.text', "Required")
    })

    it('Test save button behavior', () => {
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

    it('Test success banner behavior', () => {
        cy.get('[data-cy=alert-success')
            .should('not.be.visible')
        cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
            .select('Optional')
        cy.get('[data-cy=save-button]')
            .click()
            .then(() => {
                cy.get('[data-cy=alert-success')
                    .should('be.visible')
                cy.get('[data-cy=alert-container]')
                cy.window().its('scrollY').should('equal', 0)
                
            })
            
        // wait for the success banner to hide.
        cy.wait(3000) 
        cy.get('[data-cy=alert-success')
            .should('not.be.visible')
    })

    it('Check that save button updates the database', () => {
        // change the labor setting.
        cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input]')
            .select('Optional')

        // click the save button.
        cy.intercept('PUT', 'fd2_config/1').as('saveConfig')
        cy.get('[data-cy=save-button]')
            .click()

        // wait for the save to complete.
        cy.wait('@saveConfig')
        .then(interception => {
            expect(interception.response.statusCode).to.eq(200)

            // request the config from the database.
            cy.wrap(getConfiguration()).as('getSavedConfig')
        })

        // wait for the config to be read from db.
        cy.get('@getSavedConfig')
        .then((map) => {
            expect(map.data.labor).to.eq("Optional")
        })

        // reload and verify that the dropdown is updated correctly
        cy.reload()
        cy.get('[data-cy=labor-dropdown] > [data-cy=dropdown-input] option:selected')
            .should('have.text', "Optional")

    })
})