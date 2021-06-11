import { mount } from '@cypress/vue'

var DropdownComp = require("./dropdownWithAllComponent.js")
var DropdownWithAllComponent = DropdownComp.DropdownWithAllComponent

describe('Field and Crop Dropdowns', () => {
    it('renders the dropdown menu', () => {
        mount(DropdownWithAllComponent, {
            propsData: {
                dropdownList: [ 'Beans', 'Corn', 'Peas'],
            }
        })
        cy.get('[data-cy=dropdown-component]').should('exist')
    })
    
    it('accepts input from search bar', () => {
        mount(DropdownWithAllComponent, {
            propsData: {
                dropdownList: [ 'Beans', 'Corn', 'Peas'],
            }
        })

        cy.get('[data-cy=dropdown-input]')
            .type('Beans')
            .should('have.value', 'Beans')
    })
  
    it('contains the right crops and excludes all', () => {
        mount(DropdownWithAllComponent, {
            propsData: {
                dropdownList: ['Corn', 'Beans', 'Peas'],
            }
        })
        cy.get('[data-cy=singleOption]')
            .first().should('have.text', 'Corn')
            .next().should('have.text', 'Beans')
            .next().should('have.text', 'Peas')
    })

    it('includes the all option when the attribute is included', () => {
        mount(DropdownWithAllComponent, {
            propsData: {
                dropdownList: ['Corn', 'Beans', 'Peas'],
                includesAll: true
            }
        })
        cy.get('[data-cy=singleOption]')
            .first().should('have.text', 'All')
    })

    it('will not accept inputs that are not in the menu', () => {
        mount(DropdownWithAllComponent, {
            propsData: {
                dropdownList: ['Corn', 'Beans', 'Peas'],
                includesAll: true
            }
        })
        cy.get('[data-cy=dropdown-input]')
            .type('Lettuce')
            .blur()
            .should('have.value', '')
    })
})