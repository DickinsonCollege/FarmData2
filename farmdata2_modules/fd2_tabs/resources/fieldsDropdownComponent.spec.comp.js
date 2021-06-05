import { mount } from '@cypress/vue'
import fieldsDropdownComponent from './fieldsDropdownComponent.vue'


describe('fieldsDropdownComponent', () => {

    it('Default Fields Dropdown', () => {
        mount(fieldsDropdownComponent, {
        })

        cy.get('[data-cy=field-select]').select("None")
    })

    it('Fields Dropdown With List', () => {
        mount(fieldsDropdownComponent, {
            propsData: {
                fieldsList: [ 'a', 'b', 'c', 'd' ],
            }
        })

        cy.get('[data-cy=field-select]').select("a")
        cy.get('[data-cy=field-select]').select("d")
    })
  
})