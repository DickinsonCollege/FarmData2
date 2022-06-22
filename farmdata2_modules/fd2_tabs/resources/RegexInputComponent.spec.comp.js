import { mount } from '@cypress/vue'
import { shallowMount } from '@vue/test-utils'

var RegexInputComp = require("./RegexInputComponent.js")
var RegexInputComponent = RegexInputComp.RegexInputComponent

describe('RegexInput Component', () => {

        context('', () => {
            beforeEach(() => {
                mount(RegexInputComponent, {
                    propsData: {
                        regExp: null,
                    }
                })
            })

            it('Verifies if the input box exists', () => {
                cy.get('[data-cy=regex-input]').should('exist')
            })

            it('Verifies you can type in the input box and the value is correct', () => {
                cy.get('[data-cy=text-input]')
                    .clear()
                    .type('Hello World!')
                    .should('have.value', 'Hello World!')
        })
    })

        context('Assert false when Regex is empty', () => {
            let comp;
            beforeEach(() => {
                comp = shallowMount(RegexInputComponent, {
                    propsData: {
                        regExp: null,
                        defaultColor: null,
                        defaultVal: 'default'
                    },
                })
            })
                it('Verifies that the input box is null', () => {
                    // see if the message renders
                    expect(comp.vm.inputStyle.backgroundColor).to.equal(null)
                    cy.wrap(comp.setProps({defaultColor : '#FF0000'}))
                        .then(() => {
                            expect(comp.vm.inputStyle.backgroundColor).to.equal("#FF0000")
                    })
    
                })

                it('Verifies input emit is sent', () => {
                    const spy = cy.spy()
                    comp = shallowMount(RegexInputComponent, {
                        propsData: {
                            regExp: null,
                            defaultColor: null,
                            defaultVal: 'default'
                        },
                        listeners: {
                            'input-changed' : spy
                        },
                    })
                    // see if the message renders
                    expect(comp.vm.val).to.equal('default')
                    cy.wrap(comp.setProps({defaultVal : '100'}))
                        .then(() => {
                            expect(comp.vm.val).to.equal("100")
                            expect(spy).to.be.calledWith('100')
                    })
    
                })

        
    })
})

