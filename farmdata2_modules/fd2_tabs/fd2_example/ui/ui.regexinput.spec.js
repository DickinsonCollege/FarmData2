/**
 * The RegexInputComponent section of the UI subtab demonstrates how to 
 * use the regular expression input component to resrict the types of input
 * that can be made. This spec tests the behavior of that section.  This
 * includes testing that:
 *   - Entering valid and invalid values
 *   - changing the types of input that is valid
 *   - programmatically changing the field contents
 *   - programmatically disabling and enabling the element
 */

describe('Test the the regex input ', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    it('Check the initial state of the page.', () => {
        cy.get('[data-cy=inputed-val]').should('have.text', '')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
        cy.get('[data-cy=choose-positive-ints]').should('not.be.visible')
        cy.get('[data-cy=choose-positive-decimals]').should('be.visible')
    })

    it('Enter an invalid value into the field and ensure that it does not match.', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .type("1.23")
        .blur()

        cy.get('[data-cy=inputed-val]').should('have.text', '1.23')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('Enter a non-numeric value into the field and ensure that it does not match.', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .type("WATERMELON")
        .blur()

        cy.get('[data-cy=inputed-val]').should('have.text', '')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('Enter a valid positive integer and check that it matches.', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("10")
        .blur()

        cy.get('[data-cy=inputed-val]').should('have.text', '10')
        cy.get('[data-cy=match-val]').should('have.text', 'true')
    })

    it('Click the button to allow decimals and type a valid value.', () => {
        cy.get('[data-cy=choose-positive-decimals]').click()
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("10.5")
        .blur()

        cy.get('[data-cy=inputed-val]').should('have.text', '10.5')
        cy.get('[data-cy=match-val]').should('have.text', 'true')
    })

    it('Type a 3 digit decimal value in and test that it is not matched.', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("1.234")
        .blur()
        cy.get('[data-cy=inputed-val]').should('have.text', '1.234')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('Type a non-numeric value in as a decimal and test that it is not matched.', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("LEMONS")
        .blur()
        cy.get('[data-cy=inputed-val]').should('have.text', '')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('Click the button to allow positive ints and type a valid value.', () => {
        // first have to switch to decimals.
        cy.get('[data-cy=choose-positive-decimals]').click()
        // then back to positive integers.
        cy.get('[data-cy=choose-positive-ints]').click()
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("10")
        .blur()
        cy.get('[data-cy=inputed-val]').should('have.text', '10')
        cy.get('[data-cy=match-val]').should('have.text', 'true')

    })

    it('Click the button to clear the input after typing a valid value.', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]')
        .clear()
        .type("10")
        .blur()

        cy.get('[data-cy=reset-input-val]').click()
        cy.get('[data-cy=inputed-val]').should('have.text', '0')
        cy.get('[data-cy=match-val]').should('have.text', 'false')
    })

    it('Click the button to disable and enable the field.', () => {
        cy.get('[data-cy=regex-input] > [data-cy=text-input]').should('not.be.disabled')
        cy.get('[data-cy=btn-input-disable]').click()
        cy.get('[data-cy=regex-input] > [data-cy=text-input]').should('be.disabled')
        cy.get('[data-cy=btn-input-enable]').click()
        cy.get('[data-cy=regex-input]').should('not.be.disabled')
    })
})