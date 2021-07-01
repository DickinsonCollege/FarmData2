import { mount } from '@cypress/vue'

var DropdownComp = require("./DropdownWithAllComponent.js")
var DropdownWithAllComponent = DropdownComp.DropdownWithAllComponent

describe('Field and Crop Dropdowns', () => {
    context('without includesAll property', () => {
        beforeEach(() => {
            mount(DropdownWithAllComponent, {
                propsData: {
                    dropdownList: [ 'Beans', 'Corn', 'Peas'],
                }
            })
        })
        
        it('renders the dropdown menu', () => {
            cy.get('[data-cy=dropdown-component]').should('exist')
        })
    
        it('contains the right crops and excludes all', () => {
            cy.get('[data-cy=single-option]')
                .first().should('have.text', 'Beans')
                .next().should('have.text', 'Corn')
                .next().should('have.text', 'Peas')
        })

        it('emits an event when the selection is changed', () => {
            const spy = cy.spy()
            Cypress.vue.$on('selection-changed', spy)
            cy.get('[data-cy=dropdown-input]')
                .select('Corn')
                .then(() => {
                    expect(spy).to.be.calledOnce
                    expect(spy).to.be.calledWith('Corn')
                })
        })
    })

    context('with includesAll property', () => {
        beforeEach(() => {
            mount(DropdownWithAllComponent, {
                    propsData: {
                        dropdownList: ['Corn', 'Beans', 'Peas'],
                        includesAll: true
                    }
            })
        })

        it('includes the all option when the attribute is included', () => {
            cy.get('[data-cy=single-option]')
                .first().should('have.text', 'All')
        })
    })

    context('with defaultInput property', () => {
        beforeEach(() => {
            mount(DropdownWithAllComponent, {
                    propsData: {
                        dropdownList: ['Corn', 'Beans', 'Peas'],
                        includesAll: true,
                        defaultInput: "All"
                    },
            })
        })

        it('loads with the default input already in the search bar', () => {
            cy.get('[data-cy=dropdown-input]')
                .should('have.value', 'All')
        })
    })

    context('mounting within the test', () => {
        it('emits an event when the page loads', () => {
            const spy = cy.spy()

            mount(DropdownWithAllComponent, {
                listeners: {
                    'selection-changed': spy
                },
                propsData: {
                    dropdownList: ['Corn', 'Beans', 'Peas'],
                    includesAll: true,
                    defaultInput: "All"
                },
            })
            .then(() => {
                expect(spy).to.be.calledOnce
                expect(spy).to.be.calledWith('All')
            })
        })
    })
})