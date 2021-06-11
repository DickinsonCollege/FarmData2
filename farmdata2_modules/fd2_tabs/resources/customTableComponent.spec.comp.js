import {mount} from '@cypress/vue'
import CustomTableComponent from './customTableComponent.js'

describe('custom table component', () => {
    
    context('when edit and delete butons are not there', () => {
        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: {
                    rows: [
                            {id: 10, 
                            data: [12, 3, 'answome']},
                            {id: 11,
                            data: [19, 3, 'and'],},
                            {id: 12,
                            data: [12, 12, 'answome12'],},
                        ],
                    headers: ['cool', 'works?', 'hello'],
                }
            }) 
        })
        it('the table exist', () => {
            cy.get('[data-cy=custom-table]')
                .should('exist')
        })
        it('Displays headers in first row', () => {
            cy.get('[data-cy=headers]')
                .first().should('have.text', 'cool')
                .next().should('have.text', 'works?')
                .next().should('have.text', 'hello')
        })
        it('displays all objects in table', () => {
            cy.get('[data-cy=objectTest]')
                .first().should('have.text', '123answome  ')
                    .children()
                    .first().should('have.text', 12)
                    .next().should('have.text', 3)
                    .next().should('have.text', 'answome')
                .parent()
                .next().should('have.text', '193and  ')
                    .children()
                    .first().should('have.text', 19)
                    .next().should('have.text', 3)
                    .next().should('have.text', 'and')
                .parent()
                .next().should('have.text', '1212answome12  ')
                    .children()
                    .first().should('have.text', 12)
                    .next().should('have.text', 12)
                    .next().should('have.text', 'answome12')
        })
        it('the edit buttons should not exist', () => {
            cy.get('[data-cy=editButton]')
                .should('not.exist')
        })
        it('the delete buttons should not exist', () => {
            cy.get('[data-cy=deleteButton]')
                .should('not.exist')
        })
    })
    context('with edit and delete button', () => {
        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: {
                    rows: [
                            {id: 10, 
                            data: [12, 3, 'answome']},
                            {id: 11,
                            data: [19, 3, 'and'],},
                            {id: 12,
                            data: [12, 12, 'answome12'],},
                        ],
                    headers: ['cool', 'works?', 'hello'],
                    canEdit: true,
                    canDelete: true
                }
            })  
        })
        
        it('can edit a row using the edit button', () => {
            cy.get('[data-cy=editButton]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=testInput]')
                .first().clear().type('hey')

            cy.get('[data-cy=saveButton]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=objectTest]')
                .first().children().first()
                .should('have.text','hey')
        })
        it('can click the delete button', () => {

            cy.get('[data-cy=deleteButton]')
                .first().click()

        })
        it('save button emits changes when clicked', () => {
            cy.get('[data-cy=editButton]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=testInput]')
                .first().clear().type('hey')

            cy.get('[data-cy=saveButton]')
                .should('exist')
                .first().click().wrap({id: 10, 
                            data: ['hey', 3, 'answome']})
        })
        it('delete button emits deleted row id when clicked', () => {
            cy.get('[data-cy=deleteButton]')
                .first().click().wrap(10)

        })
    })

})