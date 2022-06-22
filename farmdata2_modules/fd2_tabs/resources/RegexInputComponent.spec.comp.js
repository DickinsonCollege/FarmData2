import { mount } from '@cypress/vue'
import { shallowMount } from '@vue/test-utils'

var RegexInputComp = require("./RegexInputComponent.js")
var RegexInputComponent = RegexInputComp.RegexInputComponent

describe('RegexInput Component', () => {

        context('normal feature tests', () => {
            beforeEach(() => {
                mount(RegexInputComponent, {
                    propsData: {
                        setColor: 'pink',
                        setHeight: '25px',
                        setWidth: '10px',
                        setMin: '0',
                        setMax: '10',
                        setStep: '1',
                    }
                })
            })

            it('exists', () => {
                cy.get('[data-cy=regex-input]').should('exist')
            })
            it('can be typed in', () => {
                cy.get('[data-cy=text-input]')
                    .clear()
                    .type('Hello World!')
                    .should('have.value', 'Hello World!')
        })
        it('make sure width exists and has a pre-set value', () => {
            cy.get('[data-cy=text-input]')
                .should('have.css', 'width', '10px')
        })
        it('make sure height exists and has a pre-set value', () => {
            cy.get('[data-cy=text-input]')
                .should('have.css','height', '25px')
        })
        it('make sure color is white and not set setColor', () => {
            cy.get('[data-cy=text-input]')
                .should('have.css','background-color', 'rgb(255, 255, 255)')
        })
        it('make sure min exists and has a pre-set value', () => {
            cy.get('[data-cy=text-input]')
                .should('have.attr','min', '0')
        })
        it('make sure max exists and has a pre-set value', () => {
            cy.get('[data-cy=text-input]')
                .should('have.attr','max', '10')
        })
        it('make sure step exists and has a pre-set value', () => {
            cy.get('[data-cy=text-input]')
                .should('have.attr','step', '1')
        })
        it('emits the new isMatch value after blur', () => {
            const spy = cy.spy()
            Cypress.vue.$on('match-changed', spy)
            cy.get('[data-cy=text-input]')
                .type('Hello world!')
                .blur()
                .then(() => {
                    expect(spy).to.be.called
                })
    })
})

    context('testing disabled option', () => {
        let comp;
        beforeEach(() => {
            //ShallowMount to test disabled option
            comp = shallowMount(RegexInputComponent, { 
                propsData: {
                    regExp: null,
                    defaultVal: null,
                    disabled: true,
                },
            })
        })
    
        it('checking if the input box is disabled', () => {
            mount(RegexInputComponent, {
                propsData: {
                    regExp: null,
                    defaultVal: null,
                    disabled: true,
                }
        })
        cy.get('[data-cy=text-input]')
        .should('be.disabled')
    })
        it('checking disabled when prop changes', () => {
            expect(comp.vm.isDisabled).to.equal(true)
            cy.wrap(comp.setProps({ disabled: false })).then(() => {
                expect(comp.vm.isDisabled).to.equal(false)
        })
    })
})

        context('emitted events test', () => {
            let comp;
            beforeEach(() => {
                comp = shallowMount(RegexInputComponent, {
                    propsData: {
                        regExp: null,
                        defaultVal: null,
                        setType: 'text',
                        setColor: 'pink',
                        setHeight: '25px',
                        setWidth: '4em',
                        setMin: null,
                        setMax: null,
                        setStep: null,
                        disabled: null
                    },
                })
            })
            it('defaultVal change emits event', () => {
                const spy = cy.spy()
                comp = shallowMount(RegexInputComponent, {
                    propsData: {
                        defaultVal: null
                        },
                    listeners: {
                        'input-changed' : spy
                        },
                    })
                    expect(comp.vm.defaultVal).to.equal(null)
                    cy.wrap(comp.setProps({defaultVal : '1205'}))
                        .then(() => {
                            expect(comp.vm.defaultVal).to.equal('1205')
                            expect(spy).to.be.calledWith('1205')
                    })
                })

            it('isMatch emits false when regex is null', () => {
                    const spy = cy.spy()
                    comp = shallowMount(RegexInputComponent, {
                        propsData: {
                            regExp: null,
                            defaultVal: null
                            },
                        listeners: {
                            'match-changed' : spy
                            },
                        })
                        expect(comp.vm.defaultVal).to.equal(null)
                        cy.wrap(comp.setProps({defaultVal : '1016'}))
                            .then(() => {
                                expect(comp.vm.defaultVal).to.equal('1016')
                                expect(spy).to.be.calledWith(false)
                        })
                    })
                it('isMatch emits true when regex is set and value is valid', () => {
                        const spy = cy.spy()
                        comp = shallowMount(RegexInputComponent, {
                            propsData: {
                                regExp: '^[1-9]+[0-9]*$',
                                defaultVal: null
                                },
                            listeners: {
                                'match-changed' : spy
                                },
                            })
                            expect(comp.vm.defaultVal).to.equal(null)
                            cy.wrap(comp.setProps({defaultVal : '1016'}))
                                .then(() => {
                                    expect(comp.vm.defaultVal).to.equal('1016')
                                    expect(spy).to.be.calledWith(true)
                            })
                        })
                    it('isMatch emits false when regex is set and value is invalid', () => {
                            const spy = cy.spy()
                            comp = shallowMount(RegexInputComponent, {
                                propsData: {
                                    regExp: '^[1-9]+[0-9]*$',
                                    defaultVal: null
                                    },
                                listeners: {
                                    'match-changed' : spy
                                    },
                                })
                                expect(comp.vm.defaultVal).to.equal(null)
                                cy.wrap(comp.setProps({defaultVal : 'cheese'}))
                                    .then(() => {

                                        expect(comp.vm.defaultVal).to.equal('cheese')
                                        expect(spy).to.be.calledWith(false)
                                })
                            })
        })
})

