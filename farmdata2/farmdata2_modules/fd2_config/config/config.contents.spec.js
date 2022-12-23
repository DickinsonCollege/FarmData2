var FarmOSAPI = require('../../resources/FarmOSAPI.js')

var getSessionToken = FarmOSAPI.getSessionToken
var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration

describe('Tests that check the contents of the config module.', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-config')
        cy.waitForPage()
    })

    it('Check labor configuration dropdown options', () => {
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
})