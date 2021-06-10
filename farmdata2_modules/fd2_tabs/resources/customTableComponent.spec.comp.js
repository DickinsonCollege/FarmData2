import {mount} from '@cypress/vue'
import CustomTableComponent from customTableComponent.js

describe('custom table component', () => {
    beforeEach(() => {
        mount(CustomTableComponent, {
            propsData: {
                rows: [
                        {id: 10, 
                        data: [12, 3, 'answome']},
                        {id: 11,
                        data: [19, 3, 'ansekjdwome'],},
                        {id: 12,
                        data: [12, 12, 'answome12'],},
                    ],
                headers: ['cool', 'works?', 'hello'],
            }
        })
    })
    it('the table exist', () => {
        cy.get('[date-cy=custom-table]')
            .should('exist')
    })
})