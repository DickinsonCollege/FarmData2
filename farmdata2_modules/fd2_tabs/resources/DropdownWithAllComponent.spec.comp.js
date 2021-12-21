import { mount } from '@cypress/vue'
import { shallowMount } from '@vue/test-utils'

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

    context('defaultInput property sets initial value', () => {
        it('loads with specified default input in the search bar', () => {
            mount(DropdownWithAllComponent, {
                propsData: {
                    dropdownList: ['Corn', 'Beans', 'Peas'],
                    defaultInput: "Beans"
                },
            })

            cy.get('[data-cy=dropdown-input]')
                .should('have.value', 'Beans')
        })

        it('emits event when mounted', () => {
            const spy = cy.spy()

            mount(DropdownWithAllComponent, {
                propsData: {
                    dropdownList: ['Corn', 'Beans', 'Peas'],
                    defaultInput: "Beans"
                },
                listeners: {
                    'selection-changed': spy
                },
            })
            .then(() => {
                expect(spy).to.be.calledOnce
                expect(spy).to.be.calledWith('Beans')
            })
        })

        it('loads with All as default the search bar', () => {
            mount(DropdownWithAllComponent, {
                propsData: {
                    dropdownList: ['Corn', 'Beans', 'Peas'],
                    includesAll: true,
                    defaultInput: "All"
                },
            })

            cy.get('[data-cy=dropdown-input]')
                .should('have.value', 'All')
        })

        it('Non-listed value as default', () => {
            mount(DropdownWithAllComponent, {
                propsData: {
                    dropdownList: ['Corn', 'Beans', 'Peas'],
                    includesAll: true,
                    defaultInput: "Nope"
                },
            })

            cy.get('[data-cy=dropdown-input]')
                .should('have.value', null)
        })
    })


    context('with includesAll property', () => {

        beforeEach(() => {
            mount(DropdownWithAllComponent, {
                    propsData: {
                        dropdownList: ['Corn', 'Beans', 'Peas'],
                        includesAll: true,
                        defaultInput: "Beans"
                    }
            })
        })

        it('includes the all option when the attribute is included', () => {
            cy.get('[data-cy=single-option]')
                .first().should('have.text', 'All')
        })

        it('All option can be selected', () => {
            const spy = cy.spy()
            Cypress.vue.$on('selection-changed', spy)
            cy.get('[data-cy=dropdown-input]')
                .select('All')
                .then(() => {
                    expect(spy).to.be.calledOnce
                    expect(spy).to.be.calledWith('All')
                })
        })
    })

    context('changing prop changes selected value', () => {
        // Would be nice to do these tests with a mount so that
        // we could check that the drop down actually changes
        // to display the correct value.

        let comp;
        beforeEach(() => {
            // Use shallowMount here so we can use setProp in its
            comp = shallowMount(DropdownWithAllComponent, {
                propsData: {
                    dropdownList: ['Corn', 'Beans', 'Peas'],
                    includesAll: true,
                    defaultInput: 'Beans',
                },
            })
        })

        it ('change prop to Corn', () => {
            expect(comp.vm.selectedOption).to.equal('Beans')
            cy.wrap(comp.setProps({ defaultInput: 'Corn' })).then(() => {
                  expect(comp.vm.selectedOption).to.equal('Corn')
            })
        })

        it('change prop to All', () => {
            expect(comp.vm.selectedOption).to.equal('Beans')
            cy.wrap(comp.setProps({ defaultInput: 'All' })).then(() => {
                  expect(comp.vm.selectedOption).to.equal('All')
            })
        })

        it('change prop to nonlisted option', () => {
            expect(comp.vm.selectedOption).to.equal('Beans')
            cy.wrap(comp.setProps({ defaultInput: 'Nope' })).then(() => {
                  expect(comp.vm.selectedOption).to.equal(null)
            })
        })

        it('change prop to null', () => {
            expect(comp.vm.selectedOption).to.equal('Beans')
            cy.wrap(comp.setProps({ defaultInput: null })).then(() => {
                  expect(comp.vm.selectedOption).to.equal(null)
            })
        })
    })
})