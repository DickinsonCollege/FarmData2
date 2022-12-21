/**
 * The Get a Single Log section of the API sub tab demonstrates
 * how to fetch a single log from the database and access its
 * information. The behavior of the page also uses the IDToCropMap
 * to translate the crop id to its name.  There is also a button
 * that clears the result.  This spec tests these functionalities.
 */

describe('Test the fetching of a single log.', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/api')

        // Because the page uses the IDToCrop map internally we will
        // wait here for the page to  fully load before continuing 
        // with the tests.
        cy.waitForPage()
    })

    it('Click fetch and ensure that crop name is translated and log info is displayed.', () => {
        cy.get('[data-cy=fetch-planting]').click()

        cy.get('[data-cy=planting-crop]')
            .should('have.text','STRAWBERRY')
        cy.get('[data-cy=planting-asset]')
            .should('contain.text','2017-08-25 STRAWBERRY SQ10')
    })

    it('Click clear and ensure that result is cleared.', () => {
        cy.get('[data-cy=fetch-planting]').click()
        cy.get('[data-cy=planting-crop]')
            .should('have.text','STRAWBERRY')

        cy.get('[data-cy=clear-planting]').click()
        cy.get('[data-cy=planting-crop]')
            .should('have.text','')  
        cy.get('[data-cy=planting-asset]')
            .should('have.text','') 
    })
})