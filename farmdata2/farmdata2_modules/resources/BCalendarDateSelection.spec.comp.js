import { mount } from '@cypress/vue2'
import { shallowMount } from '@vue/test-utils'
import { BCalendar } from 'bootstrap-vue'

var BCalendarComp = require("./BCalendarDateSelection.js")
var BCalendarDateSelection = BCalendarComp.BCalendarDateSelection

describe('BCalendarDateSelection', () => {
    it('renders a BootstrapVue calendar', () => {
        const wrapper = mount(BCalendar, {
            propsData: {
            locale: 'en'
            },
            stubs: {
            // If you're using a custom input component with BCalendar, you may need to stub it out here
            }
        })
        // const wrapper = mount(BCalendarDateSelection, {

        // })

    cy.get('[data-cy=date-select]')
        .should('exist')

    cy.get('[data-cy=date-select]')
        .should('be.visible')

    })
})