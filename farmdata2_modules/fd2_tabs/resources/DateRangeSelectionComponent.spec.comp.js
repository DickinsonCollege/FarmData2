import { mount } from '@cypress/vue'
import DateSelectionComponent from "./DateSelectionComponent.js"
import DateRangeSelectionComponent from "./DateRangeSelectionComponent.js"

describe('date range selection component', () => {
    beforeEach(() => {
        mount(DateRangeSelectionComponent, {
            propsData: {
                defaultStartDate: "2021-01-01",
                defaultEndDate: "2021-12-01"
            }
        })
    })
    it('exists', () => {
        cy.get('[data-cy=start-date-select]')
            .should('exist')

        cy.get('[data-cy=end-date-select]')
            .should('exist')
    })
    it('fail to change start date to after end date', () => {
        cy.get('[data-cy=start-date-select]')
            .children()
                .type('2056-01-01')
                .blur()
                .should('have.value', '2021-12-01')
    })
    it('fail to change end date to before start date', () => {
        cy.get('[data-cy=end-date-select]')
            .children()
                .type('2000-01-01')
                .blur()
                .should('have.value', '2021-01-01')
    })
})