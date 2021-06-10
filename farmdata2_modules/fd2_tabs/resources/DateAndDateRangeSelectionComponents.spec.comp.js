//These tests don't work yet, use the individual files for DateSelection and DateRange Selection instead

import { mount } from '@cypress/vue'
import DateSelectionComponent from "./DateAndDateRangeSelectionComponents.js"
import DateRangeSelectionComponent from "./DateAndDateRangeSelectionComponents.js"

describe.only('date selection component', () => {
    it('sets to a default date', () => {
        mount(DateSelectionComponent, {
            propsData: {
                defaultDate: "2021-06-09",
                latestDate: "2021-12-31",
                earliestDate: "2021-01-01"
            }
        })
        cy.get('[data-cy=date-select]')
            .should('have.value', '2021-06-09')
    })
    it('allows selection of the date by the user', () => {
        mount(DateSelectionComponent, {
            propsData: {
                defaultDate: "2021-06-09",
                latestDate: "2021-12-31",
                earliestDate: "2021-01-01"
            }
        })
        cy.get('[data-cy=date-select]')
            .type('2021-08-02')
            .should('have.value', '2021-08-02')
    })
    it('cannot be set to after latest date', () => {
        mount(DateSelectionComponent, {
            propsData: {
                defaultDate: "2021-06-09",
                latestDate: "2021-12-31",
                earliestDate: "2021-01-01"
            }
        })
        cy.get('[data-cy=date-select]')
            .type('2022-08-02')
            .blur()
            .should('have.value', '2021-12-31')
    })
    it('cannot be set to before earliest date', () => {
        mount(DateSelectionComponent, {
            propsData: {
                defaultDate: "2021-06-09",
                latestDate: "2021-12-31",
                earliestDate: "2021-01-01"
            }
        })
        cy.get('[data-cy=date-select]')
            .type('2010-08-02')
            .blur()
            .should('have.value', '2021-01-01')
    })
})

describe('date range selection component', () => {
    it('exists', () => {
        mount(DateRangeSelectionComponent, {
            propsData: {
                defaultStartDate: "2021-01-01",
                defaultEndDate: "2021-12-01"
            }
        })
        cy.get('[data-cy=start-date-select]')
            .should('exist')

        cy.get('[data-cy=end-date-select]')
            .should('exist')
    })
    it('fail to change start date to after end date', () => {
        mount(DateRangeSelectionComponent, {
            propsData: {
                defaultStartDate: "2021-01-01",
                defaultEndDate: "2021-12-01"
            }
        })
        cy.get('[data-cy=start-date-select]')
            .children()
                .type('2056-01-01')
                .blur()
                .should('have.value', '2021-12-01')
    })
    it('fail to change end date to before start date', () => {
        mount(DateRangeSelectionComponent, {
            propsData: {
                defaultStartDate: "2021-01-01",
                defaultEndDate: "2021-12-01"
            }
        })
        cy.get('[data-cy=end-date-select]')
            .children()
                .type('2000-01-01')
                .blur()
                .should('have.value', '2021-01-01')
    })
})