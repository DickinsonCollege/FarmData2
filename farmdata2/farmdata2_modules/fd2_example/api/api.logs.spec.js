/**
 * The Fetching Logs section of teh API subtab demonstrates how a collection
 * of logs can be fetched from the database and some of their information
 * is displayed in a table.  This functionality uses the IDToCropMap in the
 * page to translate from crop id to crop name.  This spec checks that the 
 * Fetch button retrieves and displays the proper information (including the
 * translation of the crop name) and that the clear button clears the results.
 */

describe('Test the fetching of multiple logs', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/api')

        // The page requests and then uses the IDToCropMap to display crop names
        // so we wait here to ensure the page is fully loaded before testing.
        cy.waitForPage()
    })

    it('Click Fetch and spot check first/last row of table.', () => {
        cy.get('[data-cy=fetch-seedings]').click()

        cy.get('[data-cy=0date]')
            .should('have.text','2020/05/04')
        cy.get('[data-cy=0crop]')
            .should('have.text','POTATO')
        cy.get('[data-cy=0area]')
            .should('have.text','ALF-4')

        cy.get('[data-cy=13date]')
            .should('have.text','2020/05/05')
        cy.get('[data-cy=13crop]')
            .should('have.text','CORN-SWEET')
        cy.get('[data-cy=13area]')
            .should('have.text','ALF-1')
    })

    it('Click clear and ensure table is cleared.', () => {
        // load the logs...
        cy.get('[data-cy=fetch-seedings]').click()
        cy.get('[data-cy=13area]')
            .should('have.text','ALF-1')
    
        // Then clear them.
        cy.get('[data-cy=clear-seedings]').click()
        cy.get('[data-cy=0date]')
            .should('not.exist')
    })
})