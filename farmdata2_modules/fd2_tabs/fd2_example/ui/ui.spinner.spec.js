describe('Test the content loading spinner', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('spinner appears while loading', () => {
        cy.get('[data-cy=loading-spinner]')
            .should('not.exist')

        cy.get('[data-cy=fetch-seeding-logs]')
            .click()

        cy.get('[data-cy=loading-spinner]')
            .should('exist')
        cy.get('[data-cy=first-log-name]')
            .should('have.text','2019-02-04 RADISH CHUAU-2')
        cy.get('[data-cy=loading-spinner]')
            .should('exist')
        cy.get('[data-cy=last-log-name]')
            .should('have.text','2019-03-25 PEPPERS-BELL')
        cy.get('[data-cy=loading-spinner]')
            .should('exist')
        cy.get('[data-cy=last-log-name]')
            .should('have.text','2019-04-26 LEEK')
            
        cy.get('[data-cy=loading-spinner]')
            .should('not.exist')
    })
})