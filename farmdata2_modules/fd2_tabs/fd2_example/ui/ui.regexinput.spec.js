/**
 * This spec tests the behavior of the RegexInputComponent that 
 * appears on the UI subtab.
 */

describe('Test the the regex input ', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('check initial value', () => {
        cy.get('[data-cy=inputed-val]').should('have.text', '')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('enter an invalid value into the input box', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .type("WATERMELLON")
        .blur()
        cy.get('[data-cy=inputed-val]').should('have.text', '')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('click the button for positive decimals and test positive results', () => {
        cy.get('[data-cy=choose-positive-decimals]').click()
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("10.5")
        .blur()
        cy.get('[data-cy=inputed-val]').should('have.text', '10.5')
        cy.get('[data-cy=match-val]').should('have.text', 'true')

    })

    it('click the button for positive decimals and test negative results', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("LEMONS")
        .blur()
        cy.get('[data-cy=inputed-val]').should('have.text', '')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('click the button for positive ints and test positive results', () => {
        cy.get('[data-cy=choose-positive-ints]').click()
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("10")
        .blur()
        cy.get('[data-cy=inputed-val]').should('have.text', '10')
        cy.get('[data-cy=match-val]').should('have.text', 'true')

    })

    it('click the button for positive reals and test negative results', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("10.5")
        .blur()
        cy.get('[data-cy=inputed-val]').should('have.text', '10.5')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('click reset button and check val in input box', () => {
        cy.get('[data-cy=reset-input-val]').click()
        cy.get('[data-cy=inputed-val]').should('have.text', '0')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('disable and enable the input', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]').should('not.be.disabled')
        cy.get('[data-cy=btn-input-disable]').click()
        cy.get('[data-cy=regex-input] > [data-cy=text-input]').should('be.disabled')
        cy.get('[data-cy=btn-input-enable]').click()
        cy.get('[data-cy=regex-input]').should('not.be.disabled')
    })
})