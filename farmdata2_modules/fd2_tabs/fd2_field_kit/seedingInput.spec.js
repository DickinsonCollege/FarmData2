const dayjs = require('dayjs')

describe('Test the seeding input page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
    })
    context.only('sets up the page', () => {
        it('visits the page', () => {
            cy.visit('/farm/fd2-field-kit/seedingInput')
        })
    })
    context('test inputs and buttons', () => {
        it('button is disabled', () => {
            cy.get('[data-cy=submit-button]')
                .should('exist')
                .should('be.disabled')
        })
        it('input new date', () => {
            cy.get('[data-cy=date-selection')
                .should('exist')

            cy.get('[data-cy=date-select')
                .should('exist')
                .type('2021-05-07')
        })
        it.only('select a crop', () => {
            cy.get('[data-cy=crop-selection')
                .should('exist')
            
            cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
                cy.get($dropdowns[0]).should('exist')
                .select('BEAN')
                .should('have.value', 'BEAN')
            })
                
        })
    })
})