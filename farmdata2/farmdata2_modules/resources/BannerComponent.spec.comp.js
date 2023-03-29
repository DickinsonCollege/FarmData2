import { mount } from '@cypress/vue2'
import { shallowMount } from '@vue/test-utils'

var BannerComponent = require("./BannerComponent.js")
var BannerComponent = BannerComponent.BannerComponent

describe('BannerComponent tests', () => {
    context('test if props set the initial values', () => {
        beforeEach(() => {
            mount(BannerComponent, {
                propsData: {
                    message: {"msg": "Test: Hello, I render!", "class": "alert alert-info"},
                    visible: true,
                },
            })
        })

        it('renders the component in DOM', () => {
            cy.get('[data-cy=banner-handler]').should('exist')
        })

        it('component should be visible', () => {
            cy.get('[data-cy=banner-handler]').should('be.visible')
        })

        it('has default banner message', () => {
            cy.get('[data-cy=banner-handler] > [data-cy=banner-message]')
            .should('have.text', 'Test: Hello, I render!')
        })

        it('has default banner class', () => {
            cy.get('[data-cy=banner-handler]')
            .should('have.class', 'alert alert-info')
        })
    })

    context('test prop with an updated banner object', () => {
        beforeEach(() => {
            mount(BannerComponent, {
                propsData: {
                    message: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: true,
                },
            })
        })

        it('renders the component', () => {
            cy.get('[data-cy=banner-handler]').should('exist')
        })

        it('has updated banner message', () => {
            cy.get('[data-cy=banner-handler] > [data-cy=banner-message]')
            .should('have.text', 'Test: I am a test message')
        })

        it('has updated banner class', () => {
            cy.get('[data-cy=banner-handler]')
            .should('have.class', 'alert alert-info')
        })
    })

    context('test banner with timeout', () => {
        let wrapper
        let div
        let spy
        beforeEach(() => {
            div = document.createElement('div')
            document.body.appendChild(div)
            spy = cy.spy()
            wrapper = shallowMount(BannerComponent, {
                attachTo: div,
                propsData: {
                    message: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: false,
                    timeout: true,
                },
            })
        })

        afterEach(() => {
            wrapper.destroy()
        })

        it('test hide banner', () => {
            expect(wrapper.vm.visible).to.equal(false)
            expect(wrapper.vm.isVisible).to.equal(false)
            cy.wrap(wrapper.setProps({ visible: true }))
            cy.wait(5000)
            .then(() => {
                expect(wrapper.vm.isVisible).to.equal(false)
            })
        })

        it('test no emit if parent page set prop to false', () => {
            expect(wrapper.vm.visible).to.equal(false)
            expect(wrapper.vm.isVisible).to.equal(false)
            cy.wrap(wrapper.setProps({ visible: true }))
            .then(() => {
                expect(wrapper.vm.isVisible).to.equal(false)
            })
            cy.wrap(wrapper.setProps({ visible: false }))
            .then(() => {
                expect(wrapper.vm.isVisible).to.equal(false)   
                expect(spy).to.not.be.called
            })
        })
    })

    context('test banner without timeout', () => {
        beforeEach(() => {
            mount(BannerComponent, {
                propsData: {
                    message: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: true,
                },
            })
        })

        it('test hide banner', () => {    
            cy.get('[data-cy=banner-handler]')
            .should('be.visible')

            cy.get('[data-cy=banner-handler] > [data-cy=banner-close]')
            .click()

            cy.get('[data-cy=banner-handler]')
            .should('not.be.visible')
        })
    })

    context('test prop changes', () => {
        let comp;
        beforeEach(() => {
            comp = shallowMount(BannerComponent, {
                propsData: {
                    message: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: true,
                    timeout: 5000,
                },
            })
        })

        it('change update banner object', () => {
            expect(comp.vm.message.msg).to.equal('Test: I am a test message')
            expect(comp.vm.message.class).to.equal('alert alert-info')
            cy.wrap(comp.setProps({ message: {"msg": "Cypress Test: Hello!", "class": "alert alert-warning"}}))
            .then(() => {
                expect(comp.vm.message.msg).to.equal('Cypress Test: Hello!') 
                expect(comp.vm.message.class).to.equal('alert alert-warning')    
            })
        })

        it('change visibility', () => {
            expect(comp.vm.visible).to.equal(true)
            cy.wrap(comp.setProps({ visible: false }))
            .then(() => {
                expect(comp.vm.visible).to.equal(false)
            })
        })

        it('change timeout', () => {
            expect(comp.vm.timeout).to.equal(5000)
            cy.wrap(comp.setProps({ timeout: null }))
            .then(() => {
                expect(comp.vm.timeout).to.equal(null)
            })
        })
    })

    context('test banner hidden emit', () => {

        it('banner emit occurs when x is clicked', () => {
            const spy = cy.spy()
            mount(BannerComponent, {
                propsData: {
                    message: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: true,
                },
                listeners: {
                    'banner-hidden' : spy
                },
            })  
            cy.get('[data-cy=banner-handler]').should('exist')
            cy.get('[data-cy=banner-handler] > [data-cy=banner-close]')
                .click()
            .then(() => {
                expect(spy).to.be.called
            })
        })

        it('banner emit occurs when timeout is enabled', () => {
            let wrapper
            let div
            const spy = cy.spy()

            div = document.createElement('div')
            document.body.appendChild(div)

            wrapper = shallowMount(BannerComponent, {
                attachTo: div,
                propsData: {
                    message: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: false,
                    timeout: true,
                },
                listeners: {
                    'banner-hidden' : spy
                },
            })

            cy.get('[data-cy=banner-handler]').should('exist')
            cy.wrap(wrapper.setProps({visible : true}))
            cy.wait(5000)
            .then(() => {
                expect(spy).to.be.called
            })
        })
    })
})