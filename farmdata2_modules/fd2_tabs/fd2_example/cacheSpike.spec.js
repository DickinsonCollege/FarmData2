describe('testing the cache spike page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2', {timeout: 60000})

        cy.visit('/farm/fd2-example/cacheSpike', {timeout: 120000})
    })
    it.only('test that it saves what is written in input', () => {
        cy.get('[data-cy=text-input]')
            .should('exist')
            .type('Saving to Cache')
            .should('have.value', 'Saving to Cache')

        cy.get('[data-cy=text-button')
            .should('exist')
            .click()
            
        cy.reload()

        cy.get('[data-cy=text-input]')
            .should('have.value', 'Saving to Cache')
    })
    it('test that it saves array in cache', () => {
        
    })
})