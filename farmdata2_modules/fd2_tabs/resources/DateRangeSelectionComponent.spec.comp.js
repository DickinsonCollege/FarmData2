import { mount } from '@cypress/vue'
import { shallowMount } from '@vue/test-utils'

var DateComps = require("./DateRangeSelectionComponent.js")
var DateRangeSelectionComponent = DateComps.DateRangeSelectionComponent

describe('date range selection component', () => {
    context('normal feature tests', () => {
        beforeEach(() => {
            mount(DateRangeSelectionComponent, {
                propsData: {
                    setStartDate: "2021-01-01",
                    setEndDate: "2021-12-01"
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

        it('emits the new selected start date', () => {
            const spy = cy.spy()
            Cypress.vue.$on('start-date-changed', spy)
            cy.get('[data-cy=start-date-select]')
                .children()
                    .type('2021-05-01')
                    .blur()
                    .then(() => {
                        expect(spy).to.be.called
                    })
        })

        it('emits on click', () => {
            const spy = cy.spy()
            Cypress.vue.$on('click', spy)
            cy.get('[data-cy=start-date-select]')
                .children().click()
                    .then(() => {
                        expect(spy).to.be.called
                    })
        })

        it('emits the new selected end date', () => {
            const spy = cy.spy()
            Cypress.vue.$on('end-date-changed', spy)
            cy.get('[data-cy=end-date-select]')
                .children()
                    .type('2021-07-01')
                    .blur()
                    .then(() => {
                        expect(spy).to.be.calledWith('2021-07-01')
                    })
        })
    })
    context('watch prop change test', () => {
        let comp;
        beforeEach(() => {  
            // Use shallowMount here so we can use setProp
            comp = shallowMount(DateRangeSelectionComponent, {
                propsData: {
                    setStartDate: "2021-01-01",
                    setEndDate: "2021-12-31"
                }   
            })
        })

        it ('change setStartDate prop to 2021-08-09', () => {
            expect(comp.vm.earliestEndDate).to.equal('2021-01-01')
            cy.wrap(comp.setProps({ setStartDate: '2021-08-09' }))
            .then(() => {
                expect(comp.vm.earliestEndDate).to.equal('2021-08-09')
            })
        })

        it ('change setEndDate prop to 2021-09-09', () => {
            expect(comp.vm.latestStartDate).to.equal('2021-01-01')
            cy.wrap(comp.setProps({ setEndDate: '2021-09-09' }))
            .then(() => {
                expect(comp.vm.latestStartDate).to.equal('2021-08-09')
            })
        })


    })

    context('emitted event test', () => {
        let prop = {
            setStartDate: "2021-01-01",
            setEndDate: "2021-12-31"
        }   
        
        it('emits date after the component is mounted', () => {   
            const spyStartDate = cy.spy()
            const spyEndDate = cy.spy()
            mount(DateRangeSelectionComponent, {
                propsData: prop,
                listeners: {
                    'start-date-changed': spyStartDate,
                    'end-date-changed': spyEndDate
                }
            })
            .then(() => {
                expect(spyStartDate).to.be.calledWith('2021-01-01')
                expect(spyEndDate).to.be.calledWith('2021-12-31')
            })
        })

        it('emits start and end dates after the prop is changed', () => {   
            const spyStartDate = cy.spy()
            const spyEndDate = cy.spy()
            let comp = shallowMount(DateRangeSelectionComponent, {
                propsData: prop,
                listeners: {
                    'start-date-changed': spyStartDate,
                    'end-date-changed': spyEndDate
                }
            })
            cy.wrap(comp.setProps({
                setStartDate: '2021-02-01',
                setEndDate: '2022-11-31',
            }))
            .then(() => {
                expect(spyStartDate).to.be.calledWith('2021-02-01')
                expect(spyEndDate).to.be.calledWith('2022-11-31')
            })
        })
    })
})