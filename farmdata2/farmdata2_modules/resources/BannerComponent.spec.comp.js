import { mount } from '@cypress/vue2'
import { shallowMount } from '@vue/test-utils'

var ErrorBannerComp = require("./ErrorBannerComponent.js")
var ErrorBannerComponent = ErrorBannerComp.ErrorBannerComponent

describe('ErrorBannerComponent tests', () => {
    context('test if props set the initial values', () => {
        beforeEach(() => {
            mount(ErrorBannerComponent, {
                propsData: {
                    errMessage: 'test message',
                    visible: true,
                }
            })
        })

        it('renders the component', () => {
            cy.get('[data-cy=alert-err-handler]').should('exist')
        })

        it('has correct error message', () => {
            cy.get('[data-cy=alert-err-handler] > [data-cy=alert-err-message]')
            .should('have.text', 'test message')
        })
    })

    context('test methods', () => {
        beforeEach(() => {
            mount(ErrorBannerComponent, {
                propsData: {
                    errMessage: 'test message',
                    visible: true,
                }
            })
        })

        it('test hide banner', () => {
            cy.get('[data-cy=alert-err-handler]').click()
            .should('not.be.visible')
        })
    })

    context('test prop changes', () => {
        let comp;
        beforeEach(() => {
            comp = shallowMount(ErrorBannerComponent, {
                propsData: {
                    errMessage: 'test message',
                    visible: true,
                }
            })
        })

        it('change error message', () => {
            expect(comp.vm.errMessage).to.equal('test message')
            cy.wrap(comp.setProps({ errMessage: 'hello world'}))
            .then(() => {
                expect(comp.vm.errMessage).to.equal('hello world')    
            })
        })

        it('change visibility', () => {
            expect(comp.vm.visible).to.equal(true)
            cy.wrap(comp.setProps({ visible: false }))
            .then(() => {
                expect(comp.vm.visible).to.equal(false)
            })
        })
    })
})