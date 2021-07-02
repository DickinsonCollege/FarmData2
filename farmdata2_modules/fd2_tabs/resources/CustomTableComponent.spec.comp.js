import {mount} from '@cypress/vue'

var CustTable = require("./CustomTableComponent.js")
var CustomTableComponent = CustTable.CustomTableComponent

describe('custom table component', () => {
    
    context('when edit and delete buttons are not there', () => {
        let prop= {
            rows: [ {id: 10, data: [12, 3, 'answome']},
                    {id: 11, data: [19, 3, 'and'],},
                    {id: 12, data: [12, 12, 'answome12'],}, ],
            headers: ['cool', 'works?', 'hello'],
            visibleColumns: [true, true, true]
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            }) 
        })

        it('the table exists', () => {
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
            cy.get('[data-cy=object-test]')
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
            cy.get('[data-cy=edit-button]')
                .should('not.exist')
        })

        it('the delete buttons should not exist', () => {
            cy.get('[data-cy=delete-button]')
                .should('not.exist')
        })

        it('prop change updates table', () => {
            prop.rows[0].data = [ 5, 10, 'Wahooo' ]

            cy.get('[data-cy=table-data]')
                .first().next().next()
                .should('have.text', 'Wahooo')
        })
        
        it('renders HTML elements found in strings', () => {
            prop.rows[0].data = [ 5, 10, '<p>html baby!<p>' ]

            cy.get('[data-cy=table-data]')
                .first().next().next()
                .should('have.text', 'html baby!')
        })
    })

    context('with edit and delete button', () => {
        let prop = {
                    rows: [
                            {id: 10, 
                            data: [12, 3, 'answome']},
                            {id: 11,
                            data: [19, 3, 'and'],},
                            {id: 12,
                            data: [12, 12, 'answome12'],},
                        ],
                    headers: ['cool', 'works?', 'hello'],
                    visibleColumns: [true, true, true],
                    canEdit: true,
                    canDelete: true
                }
        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            })  
        })
        
        it('can edit a row using the edit button', () => {
            cy.get('[data-cy=edit-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=test-input]')
                .first().clear().type('hey')

            cy.get('[data-cy=save-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=object-test]')
                .first().children().first()
                .should('have.text','hey')
        })

        it('can click the delete button', () => {
            cy.get('[data-cy=delete-button]')
                .first().click()
        })

        it('save button emits changes when clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-edited', spy)
            cy.get('[data-cy=edit-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=test-input]')
                .first().clear().type('hey')

            cy.get('[data-cy=save-button]')
                .should('exist')
                .first().click()
                .then(() => {
                    expect(spy).to.be.calledWith({cool: 'hey'}, 10)
                })
        })

        it('delete button emits deleted row id when clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-deleted', spy)
            cy.get('[data-cy=delete-button]')
                .first().click()
                .then(() => {
                    expect(spy).to.be.calledWith(10)
                })
        })

        it('only one row is editable at a time', () => {
            cy.get('[data-cy=edit-button]')
            .first().click()

            cy.get('[data-cy=edit-button]')
                .first().should('be.disabled')
        })
    })

    context('with invisible columns', () => {
        let prop= {
            rows: [ {id: 10, data: [12, 3, 'answome']},
                    {id: 11, data: [19, 3, 'and'],},
                    {id: 12, data: [12, 12, 'answome12'],}, ],
            headers: ['cool', 'works?', 'hello'],
            visibleColumns: [true, false, true]
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            }) 
        })

        it('only headers with corresponsing true property', () => {
            cy.get('[data-cy=headers]')
                .first().should('have.text', 'cool')
                .next().should('have.text', 'hello')
        })

        it('only displays rows with corresponsing true property', () => {
            cy.get('[data-cy=object-test]')
                .first().should('have.text', '12answome  ')
                    .children()
                    .first().should('have.text', 12)
                    .next().should('have.text', 'answome')
                .parent()
                .next().should('have.text', '19and  ')
                    .children()
                    .first().should('have.text', 19)
                    .next().should('have.text', 'and')
                .parent()
                .next().should('have.text', '12answome12  ')
                    .children()
                    .first().should('have.text', 12)
                    .next().should('have.text', 'answome12')
        })
    })

})