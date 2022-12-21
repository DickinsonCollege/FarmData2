/**
 * When data is loading the FarmData2 pages will display a spinner.
 * The Loading Spinner section of the UI page gives an example
 * of how this spinner is to work.  This spec loads some data and
 * tests that the spinner is displayed while the data is being loaded
 * and that it is hidden when the data has fully loaded.
 */

describe('Test the content loading spinner', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('Click Fetch Logs and test spinner is visible only while loading.', () => {
        cy.get('[data-cy=loading-spinner]')
            .should('not.exist')

        // This fetches multiple pages of data and the display updates
        // as each page loads.
        cy.get('[data-cy=fetch-seeding-logs]')
            .click()
        cy.get('[data-cy=loading-spinner]')
            .should('exist')

        // Wait for the first page of data to load
        cy.get('[data-cy=first-log-name]')
            .should('have.text','2019-02-04 RADISH CHUAU-2')
        cy.get('[data-cy=loading-spinner]')
            .should('exist')

        // Wait for another page of data to load.
        cy.get('[data-cy=last-log-name]')
            .should('have.text','2019-03-25 PEPPERS-BELL')
        cy.get('[data-cy=loading-spinner]')
            .should('exist')

        // Wait for the last page of data to load
        cy.get('[data-cy=last-log-name]')
            .should('have.text','2019-04-26 LEEK')
        // Spinner should now be gone.
        cy.get('[data-cy=loading-spinner]')
            .should('not.exist')
    })
})