var FarmOSAPI = require('../resources/FarmOSAPI.js')


describe('test some api calls in a page', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/api')
    })

    context('check farm information', () => {
        it('check farm info is fetched', () => {
            cy.get('[data-cy=farm-name]')
                .should('have.text','')

            cy.get('[data-cy=get-farm-info]').click()

            cy.get('[data-cy=farm-name]')
                .should('have.text','Sample Farm')
        })

        it('check farm info is cleared', () => {

            cy.get('[data-cy=get-farm-info]').click()
            cy.get('[data-cy=farm-name]')
                .should('have.text','Sample Farm')

            cy.get('[data-cy=clear-farm-info]').click()
            cy.get('[data-cy=farm-name]')
                .should('have.text','')
        })
    })
})