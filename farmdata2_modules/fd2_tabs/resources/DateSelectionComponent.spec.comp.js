import { mount } from '@cypress/vue'
import { shallowMount } from '@vue/test-utils'

var DateComps = require("./DateSelectionComponent.js")
var DateSelectionComponent = DateComps.DateSelectionComponent

describe('date selection component', () => {
    context('normal feature tests', () => {
        beforeEach(() => {
            mount(DateSelectionComponent, {
                propsData: {
                    setDate: "2021-06-09",
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
        
        it('emits on click', () => {
            const spy = cy.spy()
            Cypress.vue.$on('click', spy)
            cy.get('[data-cy=date-select]')
                .click()
                    .then(() => {
                        expect(spy).to.be.called
                    })
        })
    

        it('emits date after input type date is blurred', () => {
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

    context('watch prop change tests', () => {
        let comp;
        beforeEach(() => {  
            // Use shallowMount here so we can use setProp
            comp = shallowMount(DateSelectionComponent, {
                propsData: {
                    setDate: '2021-07-09',
                    latestDate: "2021-12-31",
                    earliestDate: "2021-01-01"
                },
            })
        })
        

        it ('change setDate prop to 2021-08-09', () => {
            expect(comp.vm.selectedDate).to.equal('2021-07-09')
            cy.wrap(comp.setProps({ setDate: '2021-08-09' }))
            .then(() => {
                  expect(comp.vm.selectedDate).to.equal('2021-08-09')
            })
        })
    })

    context('mount event tests', () => {
        let prop = {
            setDate: "2021-08-09",
            latestDate: "2021-12-31",
            earliestDate: "2021-01-01"
        }

        it('emits date after the component is mounted', () => {   
            const spy = cy.spy()
            mount(DateSelectionComponent, {
                propsData: prop,
                listeners: {
                    'date-changed': spy
                }
            })
            .then(() => {
                    expect(spy).to.be.calledWith('2021-08-09')
            })
        })

    })

})


