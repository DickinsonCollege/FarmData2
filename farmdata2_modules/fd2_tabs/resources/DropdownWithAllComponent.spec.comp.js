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
            cy.get('[data-cy=option0]')
            .should('have.text', 'Beans')

            cy.get('[data-cy=option1]')
            .should('have.text', 'Corn')

            cy.get('[data-cy=option2]')
            .should('have.text', 'Peas')
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

    context('selectedVal property sets initial value', () => {
        it('loads with specified default input in the search bar', () => {
            mount(DropdownWithAllComponent, {
                propsData: {
                    dropdownList: ['Corn', 'Beans', 'Peas'],
                    selectedVal: "Beans"
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
                    selectedVal: "Beans"
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
                    selectedVal: "All"
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
                    selectedVal: "Nope"
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
                        selectedVal: "Beans"
                    }
            })
        })

        it('includes the all option when the attribute is included', () => {
            cy.get('[data-cy=option0]')
            .should('have.text', 'All')
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
                    selectedVal: 'Beans',
                },
            })
        })

        it ('change prop to Corn', () => {
            expect(comp.vm.selectedOption).to.equal('Beans')
            cy.wrap(comp.setProps({ selectedVal: 'Corn' })).then(() => {
                  expect(comp.vm.selectedOption).to.equal('Corn')
            })
        })

        it('change prop to All', () => {
            expect(comp.vm.selectedOption).to.equal('Beans')
            cy.wrap(comp.setProps({ selectedVal: 'All' })).then(() => {
                  expect(comp.vm.selectedOption).to.equal('All')
            })
        })

        it('change prop to nonlisted option', () => {
            expect(comp.vm.selectedOption).to.equal('Beans')
            cy.wrap(comp.setProps({ selectedVal: 'Nope' })).then(() => {
                  expect(comp.vm.selectedOption).to.equal(null)
            })
        })

        it('change prop to null', () => {
            expect(comp.vm.selectedOption).to.equal('Beans')
            cy.wrap(comp.setProps({ selectedVal: null })).then(() => {
                  expect(comp.vm.selectedOption).to.equal(null)
                })
            })
        })

        context('changing prop emits event', () => {
            // Would be nice to do these tests with a mount so that
            // we could check that the drop down actually changes
            // to display the correct value.
    
            let comp;
            beforeEach(() => {
                // Use shallowMount here so we can use setProp in its
                const spy = cy.spy()
                comp = shallowMount(DropdownWithAllComponent, {
                    propsData: {
                        dropdownList: ['Corn', 'Beans', 'Peas'],
                        includesAll: true,
                        selectedVal: 'Beans',
                    },
                    listeners: {
                        'selection-changed': spy
                    },
                })
            })
    

            it('emits event when prop changed to corn', () => {
                const spySelected = cy.spy()
                let comp = shallowMount(DropdownWithAllComponent, {
                    propsData: {
                        dropdownList: ['Corn', 'Beans', 'Peas'],
                        includesAll: true,
                        selectedVal: 'Beans',
                    },
                    listeners: {
                        'selection-changed': spySelected
                    }
                })
                expect(comp.vm.selectedOption).to.equal('Beans')
                cy.wrap(comp.setProps({ selectedVal: 'Corn' })).then(() => {
                      expect(comp.vm.selectedOption).to.equal('Corn')
                      expect(spySelected).to.be.calledWith('Corn')

                })

            })

            it('emits event when prop changed to all', () => {
                const spySelected = cy.spy()
                let comp = shallowMount(DropdownWithAllComponent, {
                    propsData: {
                        dropdownList: ['Corn', 'Beans', 'Peas'],
                        includesAll: true,
                        selectedVal: 'Beans',
                    },
                    listeners: {
                        'selection-changed': spySelected
                    }
                })
                expect(comp.vm.selectedOption).to.equal('Beans')
                cy.wrap(comp.setProps({ selectedVal: 'All' })).then(() => {
                      expect(comp.vm.selectedOption).to.equal('All')
                      expect(spySelected).to.be.calledWith('All')

                })

            })

            it('emits event when prop changed to nonlisted option', () => {
                const spySelected = cy.spy()
                let comp = shallowMount(DropdownWithAllComponent, {
                    propsData: {
                        dropdownList: ['Corn', 'Beans', 'Peas'],
                        includesAll: true,
                        selectedVal: 'Beans',
                    },
                    listeners: {
                        'selection-changed': spySelected
                    }
                })
                expect(comp.vm.selectedOption).to.equal('Beans')
                cy.wrap(comp.setProps({ selectedVal: 'Nope' })).then(() => {
                      expect(comp.vm.selectedOption).to.equal(null)
                      expect(spySelected).to.be.calledWith(null)

                })

            })

            it('emits event when prop changed to null', () => {
                const spySelected = cy.spy()
                let comp = shallowMount(DropdownWithAllComponent, {
                    propsData: {
                        dropdownList: ['Corn', 'Beans', 'Peas'],
                        includesAll: true,
                        selectedVal: 'Beans',
                    },
                    listeners: {
                        'selection-changed': spySelected
                    }
                })
                expect(comp.vm.selectedOption).to.equal('Beans')
                cy.wrap(comp.setProps({ selectedVal: null })).then(() => {
                      expect(comp.vm.selectedOption).to.equal(null)
                      expect(spySelected).to.be.calledWith(null)

                })
            })
        })
    })