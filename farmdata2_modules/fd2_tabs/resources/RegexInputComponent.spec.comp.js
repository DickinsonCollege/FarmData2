import { mount } from '@cypress/vue'
import { shallowMount } from '@vue/test-utils'

var RegexInputComp = require("./RegexInputComponent.js")
var RegexInputComponent = RegexInputComp.RegexInputComponent

describe('RegexInput Component', () => {

        context('normal feature tests', () => {
            beforeEach(() => {
                mount(RegexInputComponent, {
                    propsData: {
                        regExp: null,
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

            it('emits the new isMatch value after blur', () => {
                const spy = cy.spy()
                Cypress.vue.$on('is-match-changed', spy)
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

        context('watch prop change tests', () => {
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
                        setTitle: null,
                        disabled: null

                    },
                })
            })

            it('change regExp prop', () => {
                    expect(comp.vm.regExp).to.equal(null)
                    cy.wrap(comp.setProps({regExp : '^[1-9]+[0-9]*$'}))
                        .then(() => {
                            expect(comp.vm.regExp).to.equal('^[1-9]+[0-9]*$')
                    })
                })
            it('change defaultVal prop', () => {
                    expect(comp.vm.defaultVal).to.equal(null)
                    cy.wrap(comp.setProps({defaultVal : '0'}))
                        .then(() => {
                            expect(comp.vm.defaultVal).to.equal('0')
                    })
                })
            it('change setType prop', () => {
                    expect(comp.vm.setType).to.equal('text')
                    cy.wrap(comp.setProps({setType : 'number'}))
                        .then(() => {
                            expect(comp.vm.setType).to.equal('number')
                    })
                })
            it('change setColor prop', () => {
                    expect(comp.vm.setColor).to.equal('pink')
                    cy.wrap(comp.setProps({setColor : 'red'}))
                        .then(() => {
                            expect(comp.vm.setColor).to.equal('red')
                    })
                })
            it('change setHeight prop', () => {
                    expect(comp.vm.setHeight).to.equal('25px')
                    cy.wrap(comp.setProps({setHeight : '15px'}))
                        .then(() => {
                            expect(comp.vm.setHeight).to.equal('15px')
                    })
                })
            it('change setWidth prop', () => {
                    expect(comp.vm.setWidth).to.equal('4em')
                    cy.wrap(comp.setProps({setWidth : '6em'}))
                        .then(() => {
                            expect(comp.vm.setWidth).to.equal('6em')
                    })
                })
            it('change setMin prop', () => {
                    expect(comp.vm.setMin).to.equal(null)
                    cy.wrap(comp.setProps({setMin : '0'}))
                        .then(() => {
                            expect(comp.vm.setMin).to.equal('0')
                    })
                })
            it('change setMax prop', () => {
                    expect(comp.vm.setMax).to.equal(null)
                    cy.wrap(comp.setProps({setMax : '10000'}))
                        .then(() => {
                            expect(comp.vm.setMax).to.equal('10000')
                    })
                })
            it('change setStep prop', () => {
                    expect(comp.vm.setStep).to.equal(null)
                    cy.wrap(comp.setProps({setStep : '2'}))
                        .then(() => {
                            expect(comp.vm.setStep).to.equal('2')
                    })
                })
            it('change setTitle prop', () => {
                    expect(comp.vm.setTitle).to.equal(null)
                    cy.wrap(comp.setProps({setTitle : 'Positive Ints Only'}))
                        .then(() => {
                            expect(comp.vm.setTitle).to.equal('Positive Ints Only')
                    })
                })
            it('change disabled prop', () => {
                    expect(comp.vm.disabled).to.equal(null)
                    cy.wrap(comp.setProps({disabled : 'true'}))
                        .then(() => {
                            expect(comp.vm.disabled).to.equal('true')
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

            it('isMatch change emits event', () => {
                    const spy = cy.spy()
                    comp = shallowMount(RegexInputComponent, {
                        propsData: {
                            defaultVal: null
                            },
                        listeners: {
                            'is-match-changed' : spy
                            },
                        })
                        expect(comp.vm.defaultVal).to.equal(null)
                        cy.wrap(comp.setProps({defaultVal : '1016'}))
                            .then(() => {
                                expect(comp.vm.defaultVal).to.equal('1016')
                                expect(spy).to.be.calledWith(false)
                        })
                    })
        })
})

