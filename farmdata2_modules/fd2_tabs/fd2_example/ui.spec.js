const dayjs = require('dayjs')

describe('Test the UI component', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    context('check the date input component', () => {

        it('test click event handler', () => {
            cy.get('[data-cy=date-clicks').should('have.text','0')

            // Need to get the element with data-cy=date-select that is
            // inside of the component with data-cy=date-picker. 
            cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()

            cy.get('[data-cy=date-clicks').should('have.text','1')
            cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-clicks').should('have.text', '2')
            cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-clicks').should('have.text', '3')
        })

        it('test date change event handler', () => {
            cy.get('[data-cy=date-picker] > [data-cy=date-select]')
            .type('2021-01-22')  // note the format for typing.
            .blur() // makes component inactive which triggers the date-change event.

            cy.get('[data-cy=date-chosen]').should('have.text', '2021-01-22')
        })
    })

    context('check the date range component', () => {

        it('test click event handler', () => {
            cy.get('[data-cy=date-range-clicks').should('have.text','0')

            // Need to get the date-select element that is inside the start-date-select element.
            // Note: We do not need to specify the full path to the element, just need to 
            // disambiguate them.
            cy.get('[data-cy=start-date-select] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-range-clicks').should('have.text','1')

            cy.get('[data-cy=end-date-select] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-range-clicks').should('have.text', '2')
        })

        it('check default end date', () => {
            cy.get('[data-cy=end-date-select] > [data-cy=date-select]')
            .should('have.value',dayjs().format("YYYY-MM-DD"))
        })

        it('test start date change event handler', () => {
            cy.get('[data-cy=start-date-select] > [data-cy=date-select]')
            .type('2021-01-22')  
            .blur()

            cy.get('[data-cy=start-date]').should('have.text', '2021-01-22')
        })

        it ('test end date change event handler', () => {
            cy.get('[data-cy=end-date-select] > [data-cy=date-select]')
            .type('2021-01-23')  
            .blur()

            cy.get('[data-cy=end-date]').should('have.text', '2021-01-23')
        })
     })
})