import { mount } from '@cypress/vue'

var DropdownComp = require("./dropdownWithAllComponent.js")
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
        
        it('accepts input from search bar', () => {
            cy.get('[data-cy=dropdown-input]')
                .type('Beans')
                .should('have.value', 'Beans')
        })
    
        it('contains the right crops and excludes all', () => {
            cy.get('[data-cy=singleOption]')
                .first().should('have.text', 'Beans')
                .next().should('have.text', 'Corn')
                .next().should('have.text', 'Peas')
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
            cy.get('[data-cy=singleOption]')
                .first().should('have.text', 'All')
        })

        it('will not accept inputs that are not in the menu', () => {
            cy.get('[data-cy=dropdown-input]')
                .type('Lettuce')
                .blur()
                .should('have.value', '')
        })
    })

    context('with defaultInput property', () => {
        beforeEach(() => {
            mount(DropdownWithAllComponent, {
                    propsData: {
                        dropdownList: ['Corn', 'Beans', 'Peas'],
                        includesAll: true,
                        defaultInput: "All"
                    }
            })
        })

        it('loads with the default input already in the search bar', () => {
            cy.get('[data-cy=dropdown-input]')
                .should('have.value', 'All')
        })
    })
})