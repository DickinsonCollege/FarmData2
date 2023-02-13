import { mount } from '@cypress/vue2'
import { shallowMount } from '@vue/test-utils'

var BannerComponent = require("./BannerComponent.js")
var BannerComponent = BannerComponent.BannerComponent

describe('BannerComponent tests', () => {
    context('test if props set the initial values', () => {
        beforeEach(() => {
            mount(BannerComponent, {
                propsData: {
                    visible: true,
                }
            })
        })

        it('renders the component', () => {
            cy.get('[data-cy=banner-handler]').should('exist')
        })

        it('has default banner message', () => {
            cy.get('[data-cy=banner-handler] > [data-cy=banner-message]')
            .should('have.text', 'Hello, I am a banner alert.')
        })

        it('has default banner class', () => {
            cy.get('[data-cy=banner-handler]')
            .should('have.class', 'alert alert-warning')
        })
    })

    context('test prop with an updated banner object', () => {
        beforeEach(() => {
            mount(BannerComponent, {
                propsData: {
                    updateBanner: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: true,
                }
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

    // fork in this one for now
    context.skip('test banner with timeout', () => {
        beforeEach(() => {
            mount(BannerComponent, {
                propsData: {
                    updateBanner: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: true,
                    timeout: 5000,
                }
            })
        })

        it('test hide banner', () => {
            
            cy.get('[data-cy=banner-handler]')
            .should('be.visible')

            cy.wait(5000)

            cy.get('[data-cy=banner-handler]')
            .should('not.be.visible')
        })
    })

    context('test banner without timeout', () => {
        beforeEach(() => {
            mount(BannerComponent, {
                propsData: {
                    updateBanner: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: true,
                }
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
                    updateBanner: {"msg": "Test: I am a test message", "class": "alert alert-info"},
                    visible: true,
                    timeout: 5000,
                }
            })
        })

        it('change update banner object', () => {
            expect(comp.vm.updateBanner.msg).to.equal('Test: I am a test message')
            expect(comp.vm.updateBanner.class).to.equal('alert alert-info')
            cy.wrap(comp.setProps({ updateBanner: {"msg": "Cypress Test: Hello!", "class": "alert alert-warning"}}))
            .then(() => {
                expect(comp.vm.updateBanner.msg).to.equal('Cypress Test: Hello!') 
                expect(comp.vm.updateBanner.class).to.equal('alert alert-warning')    
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
})