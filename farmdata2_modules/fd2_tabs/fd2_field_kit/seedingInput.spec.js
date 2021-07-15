const dayjs = require('dayjs')

describe('Test the seeding input page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
    })
    context('sets up the page', () => {
        it('visits the page', () => {
            cy.visit('/farm/fd2-field-kit/seedingInput')
            //give some time for api requests to come in
            //cy.wait(20000)
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
        it('input time spent', () => {
            cy.get('[data-cy=time-spent]')
                .should('exist')
                .click()
                .clear()
                .type('10')
                .should('have.value', '10')
        })
        it('select time unit', () => {
            cy.get('[data-cy=time-unit]')
                .should('exist')

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[2]).should('exist')
                    .select('minutes')
                    .should('have.value', 'minutes')
            })
        })
        it('input comments', () => {
            cy.get('[data-cy=comments]')
                .should('exist')
                .type('Yeeewhaw')
                .should('have.value', 'Yeeewhaw')
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
    context('select direct seedings and test its inputs', () => {
        it('select Direct Seeding', () => {
            cy.get('[data-cy=direct-seedings]')
                .should('exist')
                .check()
                .should('be.checked')
        })
        it('input a row per bed number', () =>{
            cy.get('[data-cy=row-bed]')
                .should('exist')
                .click()
                .clear()
                .type('5')
                .should('have.value', '5')
        })
        it('input the number of feet', () => {
            cy.get('[data-cy=num-feet')
                .should('exist')
                .click()
                .clear()
                .type('20')
                .should('have.value', '20')
        })
        it('select feet unit(ei. bed or row)', () => {
            cy.get('[data-cy=unit-feet')
                .should('exist')

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[3]).should('exist')
                    .select('row')
                    .should('have.value', 'row')
            })
        })
        it('check that submit button is not disabled',() => {
            cy.get('[data-cy=submit-button')
                .should('exist')
                .should('not.be.disabled')
        })
    })
})