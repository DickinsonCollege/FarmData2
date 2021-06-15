import { mount } from '@cypress/vue'

var DateComps = require("./DateSelectionComponent.js")
var DateSelectionComponent = DateComps.DateSelectionComponent

describe('date selection component', () => {
    beforeEach(() => {
        mount(DateSelectionComponent, {
            propsData: {
                defaultDate: "2021-06-09",
                latestDate: "2021-12-31",
                earliestDate: "2021-01-01"
            }
        })
    }) 

    it('sets to a default date', () => {
        cy.get('[data-cy=date-select]')
            .should('have.value', '2021-06-09')
    })

    it('allows selection of the date by the user', () => {
        cy.get('[data-cy=date-select]')
            .type('2021-08-02')
            .should('have.value', '2021-08-02')
    })

    it('cannot be set to after latest date', () => {
        cy.get('[data-cy=date-select]')
            .type('2022-08-02')
            .blur()
            .should('have.value', '2021-12-31')
    })

    it('cannot be set to before earliest date', () => {
        cy.get('[data-cy=date-select]')
            .type('2010-08-02')
            .blur()
            .should('have.value', '2021-01-01')
    })

    it('emits date after input type date is blured', () => {
        const spy = cy.spy()
        Cypress.vue.$on('date-changed', spy)
        cy.get('[data-cy=date-select]')
            .type('2021-05-02')
            .blur()
            .then(() => {
                expect(spy).to.be.calledWith('2021-05-02')
            })
    })
})