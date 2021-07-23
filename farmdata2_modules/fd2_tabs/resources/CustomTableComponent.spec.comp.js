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
                .first()
                    .children()
                    .first().should($el => expect($el.text().trim()).to.equal('12'))
                    .next().should($el => expect($el.text().trim()).to.equal('3'))
                    .next().should($el => expect($el.text().trim()).to.equal('answome'))
                .parent()
                .next()
                    .children()
                    .first().should($el => expect($el.text().trim()).to.equal('19'))
                    .next().should($el => expect($el.text().trim()).to.equal('3'))
                    .next().should($el => expect($el.text().trim()).to.equal('and'))
                .parent()
                .next()
                    .children()
                    .first().should($el => expect($el.text().trim()).to.equal('12'))
                    .next().should($el => expect($el.text().trim()).to.equal('12'))
                    .next().should($el => expect($el.text().trim()).to.equal('answome12'))
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
                .should($el => expect($el.text().trim()).to.equal('Wahooo'));
        })
        
        it('renders HTML elements found in strings', () => {
            prop.rows[0].data = [ 5, 10, '<p>html baby!</p>' ]

            cy.get('[data-cy=table-data]')
                .first().next().next()
                .should($el => expect($el.text().trim()).to.equal('html baby!'));
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
                .should($el => expect($el.text().trim()).to.equal('hey'))
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
                .first().clear().type('yo')

            cy.get('[data-cy=save-button]')
                .should('exist')
                .first().click()
                .then(() => {
                    expect(spy).to.be.calledWith({cool: 'yo'}, 10)
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

        it('disables the delete buttons when a row is being edited', () => {
            cy.get('[data-cy=edit-button]')
            .first().click()

            cy.get('[data-cy=delete-button]')
                .first().should('be.disabled')
        })

        it('emits an event when the edit button is clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('edit-clicked', spy)
            cy.get('[data-cy=edit-button]')
                .first().click()
                .then(() => {
                    expect(spy).to.be.calledWith()
                })
        })
        it('emits with an empty object payload when a cell gets changed back during editing', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-edited', spy)
            cy.get('[data-cy=edit-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=test-input]')
                .first().clear().type('hey')
                .clear().type('yo')

            cy.get('[data-cy=save-button]')
                .should('exist')
                .first().click()
                .then(() => {
                    expect(spy).to.be.calledWith({}, 10)
                })
        })
    })

    context('with invisible columns', () => {
        let prop= {
            rows: [ {id: 10, data: [12, 3, 'answome']},
                    {id: 11, data: [19, 3, 'and'],},
                    {id: 12, data: [12, 12, 'answome12'],}, ],
            headers: ['cool', 'works?', 'hello'],
            visibleColumns: [true, false, true],
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
                .first()
                    .children()
                    .first().should($el => expect($el.text().trim()).to.equal('12'))
                    .next().should($el => expect($el.text().trim()).to.equal('answome'))
                .parent()
                .next()
                    .children()
                    .first().should($el => expect($el.text().trim()).to.equal('19'))
                    .next().should($el => expect($el.text().trim()).to.equal('and'))
                .parent()
                .next()
                    .children()
                    .first().should($el => expect($el.text().trim()).to.equal('12'))
                    .next().should($el => expect($el.text().trim()).to.equal('answome12'))
        })
    })

    context('with different input types', () => {
        let prop= {
            rows: [ {id: 10, data: [12, 3, 'answome']},
                ],
            headers: ['one'],
            visibleColumns: [true],
            canEdit: true,
            inputOptions: [
                {'type': 'no input'},
            ]
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            }) 
        })

        it('does not allow you to input anything if no input is specified', () => {
            
            cy.get('[data-cy=edit-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=number-input]')
                .should("not.exist")

            cy.get('[data-cy=text-input]')
                .should("not.exist")

            cy.get('[data-cy=date-input]')
                .should("not.exist")

            cy.get('[data-cy=dropdown-table-input]')
                .should("not.exist")
        })

        it('allows you to type in a text field', () => {
            prop.inputOptions[0] = {'type': 'text'}

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
                .should($el => expect($el.text().trim()).to.equal('hey'))
        })

        it('allows you to select from a dropdown', () => {
            prop.inputOptions[0] = {'type': 'dropdown', 'value': [1, 2, 3]}
            
            cy.get('[data-cy=edit-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=dropdown-table-input]')
                .first().select('2')

            cy.get('[data-cy=save-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=object-test]')
                .first().children().first()
                .should($el => expect($el.text().trim()).to.equal('2'))
        })

        it('allows you to specify a date in a date input', () => {
            prop.inputOptions[0] = {'type': 'date'}
            
            cy.get('[data-cy=edit-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=date-input]')
                .first().type('2020-05-14')

            cy.get('[data-cy=save-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=object-test]')
                .first().children().first()
                .should($el => expect($el.text().trim()).to.equal('2020-05-14'))
        })

        it('only allows you to pick numbers in a number input', () => {
            prop.inputOptions[0] = {'type': 'number'}
            
            cy.get('[data-cy=edit-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=number-input]')
                .first().clear().type('12345abcde')

            cy.get('[data-cy=save-button]')
                .should('exist')
                .first().click()

            cy.get('[data-cy=object-test]')
                .first().children().first()
                .should($el => expect($el.text().trim()).to.equal('12345'))
        })
    })

})