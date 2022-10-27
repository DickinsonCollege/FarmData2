import { mount } from '@cypress/vue2'
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

    context('testing disabled option', () => {

        it('checking if the datePicker is disabled', () => {
            mount(DateSelectionComponent, {
                propsData: {
                    setDate: "2021-06-09",
                    latestDate: "2021-12-31",
                    earliestDate: "2021-01-01",
                    disabled: true,
                }
            })
            cy.get('[data-cy=date-select]')
            .should('be.disabled')
        })

        it('checking disabled when prop changes', () => {
            let comp;
            comp = shallowMount(DateSelectionComponent, {
                propsData: {
                    setDate: "2021-06-09",
                    latestDate: "2021-12-31",
                    earliestDate: "2021-01-01",
                    disabled: true,
                },
            })
            expect(comp.vm.isDisabled).to.equal(true)
            cy.wrap(comp.setProps({ disabled: false })).then(() => {
                expect(comp.vm.isDisabled).to.equal(false)
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

        it ('change setDate prop to date after latestDate, which will set to latestDate', () => {
            expect(comp.vm.selectedDate).to.equal('2021-07-09')
            cy.wrap(comp.setProps({ setDate: '2022-12-01' }))
            .then(() => {
                expect(comp.vm.selectedDate).to.equal('2021-12-31')
            })
        })
        it ('change setDate prop to date before earliestDate, which will set to earliestDate', () => {
            expect(comp.vm.selectedDate).to.equal('2021-07-09')
            cy.wrap(comp.setProps({ setDate: '1999-12-01' }))
            .then(() => {
                expect(comp.vm.selectedDate).to.equal('2021-01-01')
            })
        })

    })

    context('emitted event tests', () => {
        let prop = {
            setDate: "2021-08-09",
            latestDate: "2021-12-31",
            earliestDate: "2021-01-01"
        }

        let propInvalidEarliest = {
            setDate: "1999-05-01",
            latestDate: "2021-12-31",
            earliestDate: "2021-01-01"
        }

        let propInvalidLatest = {
            setDate: "2035-05-01",
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

        it('emits correct date after the component is mounted with invalid date(< than earliestDate)', () => {
            const spy = cy.spy()
            mount(DateSelectionComponent, {
                propsData: propInvalidEarliest,
                listeners: {
                    'date-changed': spy
                }
            })
            .then(() => {
                expect(spy).to.be.calledWith('2021-01-01')
            })
        })

        it('emits correct date after the component is mounted with invalid date(> than latestDate)', () => {
            const spy = cy.spy()
            mount(DateSelectionComponent, {
                propsData: propInvalidLatest,
                listeners: {
                    'date-changed': spy
                }
            })
            .then(() => {
                expect(spy).to.be.calledWith('2021-12-31')
            })
        })

        it('emits date after the prop is changed', () => {
            const spy = cy.spy()
            let comp = shallowMount(DateSelectionComponent, {
                propsData: prop,
                listeners: {
                    'date-changed': spy
                }
            })
            cy.wrap(comp.setProps({ setDate: '2021-08-09' }))
            .then(() => {
                expect(spy).to.be.calledWith('2021-08-09')
            })
        })

        it('emits correct date after the prop is changed to invalid date(< than earliestDate)', () => {
            const spy = cy.spy()
            let comp = shallowMount(DateSelectionComponent, {
                propsData: prop,
                listeners: {
                    'date-changed': spy
                }
            })
            cy.wrap(comp.setProps({ setDate: '2000-08-09' }))
            .then(() => {
                expect(spy).to.be.calledWith('2021-01-01')
            })
        })

        it('emits correct date after the prop is changed to invalid date(> than latestDate)', () => {
            const spy = cy.spy()
            let comp = shallowMount(DateSelectionComponent, {
                propsData: prop,
                listeners: {
                    'date-changed': spy
                }
            })
            cy.wrap(comp.setProps({ setDate: '2029-08-09' }))
            .then(() => {
                expect(spy).to.be.calledWith('2021-12-31')
            })
        })

    })
})
