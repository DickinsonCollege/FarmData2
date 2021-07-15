const dayjs = require('dayjs')

describe('Test the seeding input page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
    })
    context('sets up the page', () => {
        it('visits the page', () => {
            cy.visit('/farm/fd2-field-kit/seedingInput')
            cy.wait(40000)
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
        it('select a crop', () => {
            cy.get('[data-cy=crop-selection')
                .should('exist')
            
            cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
                cy.get($dropdowns[0]).should('exist')
                    .select('BEAN')
                    .should('have.value', 'BEAN')
            })  
        })
        it('input num of workers', () => {
            cy.get('[data-cy=num-workers]')
                .should('exist')
                .click()
                .clear()
                .type('2')
                .should('have.value', '2')
        })
        //last b/c it take sthe longest to load in
        it('select a area', () => {
            cy.get('[data-cy=area-selection')
                .should('exist') 
            
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).should('exist')
                    .select('A')
                    .should('have.value', 'A')
            })
        })
        
    })
})