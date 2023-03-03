import { mount } from '@cypress/vue2'
import { shallowMount } from '@vue/test-utils'

var CustTable = require("./CustomTableComponent.js")
var CustomTableComponent = CustTable.CustomTableComponent

describe('custom table component', () => {
    
    context('when edit, delete, csv, and custom buttons are not present', () => {
        let prop = {
            rows: [            
                {id: 1, data: ['1', 'Shirt', 'S', 'Green', 5, '2020-01-01', true]},
                {id: 2, data: ['5', 'Pants', 'L', 'Blue', 12, '2020-05-01', true]},
                {id: 3, data: ['9', 'Hat', 'M', 'Black', 8, '2020-03-01', false]}
            ],
            columns: [
                {"header": "ID", "visible": true, "inputType": {'type': 'no input'}},
                {"header": 'Item', "visible": true, "inputType": {'type': 'text'}},
                {"header": 'Size', "visible": false, "inputType": {'type': 'dropdown','value': ['S', 'M', 'L']}},
                {"header": 'Color', "visible": true, "inputType": {'type': 'dropdown','value': ['Green', 'Blue', 'Black', 'Red']}},
                {"header": 'Count', "visible": true, "inputType": {'type': 'regex', 'regex': '^[1-9]+[0-9]*$'}},
                {"header": 'Date', "visible": true, "inputType": {'type': 'date'}},
                {"header": "Purchased", "visible": true, "inputType": {'type': 'boolean'}},
            ],
            customButtons: [
                ],
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            }) 
        })

        it('the table exists', () => {
            cy.get('[data-cy=table]')
                .should('exist')
        })

        it('the csv button does not exist', () => {
            cy.get('[data-cy=export-btn')
                .should('not.exist')
        })

        
        it('the delete buttons should not exist', () => {
            cy.get('[data-cy=delete-button]')
                .should('not.exist')
        })

        it('the edit buttons should not exist', () => {
            cy.get('[data-cy=edit-button]')
                .should('not.exist')
        })

        it('Displays headers', () => {
            cy.get('[data-cy=h0]').should('have.text', 'ID')
            cy.get('[data-cy=h1]').should('have.text', 'Item')
            cy.get('[data-cy=h2]').should('not.exist')
            cy.get('[data-cy=h3]').should('have.text', 'Color')
            cy.get('[data-cy=h4]').should('have.text', 'Count')
            cy.get('[data-cy=h5]').should('have.text', 'Date')
            cy.get('[data-cy=h6]').should('have.text', 'Purchased')

        })

        it('displays all objects in table', () => {
            cy.get('[data-cy=r0-ID]').should('have.text', '1')
            cy.get('[data-cy=r0-Item]').should('have.text', 'Shirt')
            cy.get('[data-cy=r0-Color]').should('have.text', 'Green')
            cy.get('[data-cy=r0-Count]').should('have.text', '5')
            cy.get('[data-cy=r0-Date]').should('have.text', '2020-01-01')
            cy.get('[data-cy=r0-Purchased-input]').should('be.checked')

            cy.get('[data-cy=r1-ID]').should('have.text', '5')
            cy.get('[data-cy=r1-Item]').should('have.text', 'Pants')
            cy.get('[data-cy=r1-Color]').should('have.text', 'Blue')
            cy.get('[data-cy=r1-Count]').should('have.text', '12')
            cy.get('[data-cy=r1-Date]').should('have.text', '2020-05-01')
            cy.get('[data-cy=r1-Purchased-input]').should('be.checked')

            cy.get('[data-cy=r2-ID]').should('have.text', '9')
            cy.get('[data-cy=r2-Item]').should('have.text', 'Hat')
            cy.get('[data-cy=r2-Color]').should('have.text', 'Black')
            cy.get('[data-cy=r2-Count]').should('have.text', '8')
            cy.get('[data-cy=r2-Date]').should('have.text', '2020-03-01')
            cy.get('[data-cy=r2-Purchased-input]').should('not.be.checked')
        })

        it('prop change to the rows updates table', () => {
            prop.rows[0].data = ['10', 'Sweater', 'M', 'Grey', 16, '2001-10-16', false]

            cy.get('[data-cy=r0-ID]').should('have.text', '10')
            cy.get('[data-cy=r0-Item]').should('have.text', 'Sweater')
            cy.get('[data-cy=r0-Color]').should('have.text', 'Grey')
            cy.get('[data-cy=r0-Count]').should('have.text', '16')
            cy.get('[data-cy=r0-Date]').should('have.text', '2001-10-16')
            cy.get('[data-cy=r0-Purchased-input]').should('not.be.checked')
        })

        it('prop change to the column visibility updates table', () => {
            prop.columns[2].visible = true

            cy.get('[data-cy=r0-ID]').should('have.text', '10')
            cy.get('[data-cy=r0-Item]').should('have.text', 'Sweater')
            cy.get('[data-cy=r0-Size]').should('have.text', 'M')
            cy.get('[data-cy=r0-Color]').should('have.text', 'Grey')
            cy.get('[data-cy=r0-Count]').should('have.text', '16')
            cy.get('[data-cy=r0-Date]').should('have.text', '2001-10-16')
            cy.get('[data-cy=r0-Purchased-input]').should('not.be.checked')
        })
        
        it('renders HTML elements found in strings', () => {
            prop.rows[0].data = ['10', '<p>Testing out HTML elements found in strings.</p>', 'M', 'Grey', 16, '2001-10-16', false]
            cy.get('[data-cy=r0-Item]').should('have.text', 'Testing out HTML elements found in strings.')
        })
    })

    context('with edit, delete, CSV, and custom buttons', () => {
        let prop = {
            rows: [            
                {id: 1, data: ['1', 'Shirt', 'S', 'Green', 5, '2020-01-01', true]},
                {id: 2, data: ['5', 'Pants', 'L', 'Blue', 12, '2020-05-01', true]},
                {id: 3, data: ['9', 'Hat', 'M', 'Black', 8, '2020-03-01', false]}
            ],
            columns: [
                {"header": "ID", "visible": true, "inputType": {'type': 'no input'}},
                {"header": 'Item', "visible": true, "inputType": {'type': 'text'}},
                {"header": 'Size', "visible": false, "inputType": {'type': 'dropdown','value': ['S', 'M', 'L']}},
                {"header": 'Color', "visible": true, "inputType": {'type': 'dropdown','value': ['Green', 'Blue', 'Black', 'Red']}},
                {"header": 'Count', "visible": true, "inputType": {'type': 'regex', 'regex': '^[1-9]+[0-9]*$'}},
                {"header": 'Date', "visible": true, "inputType": {'type': 'date'}},
                {"header": "Purchased", "visible": true, "inputType": {'type': 'boolean'}},
            ],
            customButtons: [
                {"hoverTip": 'Clone', "visible": true, "inputType": {'type': 'button', 'value': 'glyphicon glyphicon-asterisk', 'buttonClass': 'table-button btn btn-warning', 'event': 'clone'}},
                ],
            canDelete: true,
            canEdit: true,
            csvName: "unitTest_"
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            })  
        })
        
        it('can edit a row using the edit button', () => {
            cy.get('[data-cy=r0-edit-button]')
                .should('exist')
                .click()

            cy.get('[data-cy=r0-Item-input]')
                .clear()
                .type('Socks')

            cy.get('[data-cy=r0-save-button]')
                .should('exist')
                .click()

            cy.get('[data-cy=r0-Item]')
                .should('have.text', 'Socks')
        })

        it('can cancel an edit using the cancel button', () => {
            cy.get('[data-cy=r0-cancel-button]')
            .should('not.exist')

            cy.get('[data-cy=r0-edit-button]')
                .should('exist')
                .click()

            cy.get('[data-cy=r0-Item-input]')
                .clear()
                .type('Shirt')

            cy.get('[data-cy=r0-cancel-button]')
                .should('exist')
                .click()

            cy.get('[data-cy=r0-Item]')
                .should('have.text', 'Socks')
            
            cy.get('[data-cy=r0-cancel-button]')
                .should('not.exist')
        })

        it('only one row is editable at a time', () => {
            cy.get('[data-cy=r0-edit-button]')
                .click()

            cy.get('[data-cy=r1-edit-button]')
                .should('be.disabled')
            cy.get('[data-cy=r2-edit-button]')
                .should('be.disabled')
        })

        
        it('editing disables all other buttons and leftmost column', () => {
            cy.get('[data-cy=r0-edit-button]')
                .click()

            cy.get('[data-cy=r1-edit-button]')
                .should('be.disabled')
            cy.get('[data-cy=r2-edit-button]')
                .should('be.disabled')
        })

        it('clicking edit emits row id', () => {
            const spy = cy.spy()
            Cypress.vue.$on('edit-clicked', spy)
            cy.get('[data-cy=r1-edit-button]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith(2)
                })
        })

        it('save button emits changes when clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-edited', spy)
            cy.get('[data-cy=r0-edit-button]')
                .click()

            cy.get('[data-cy=r0-Item-input]')
                .clear()
                .type('Hoodie')

            cy.get('[data-cy=r0-save-button]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith({"Item": 'Hoodie'}, 1)
                })
        })

        it('custom button disabled when no checkboxes are checked', () => {
            cy.get('[data-cy=clone-button]')
                .should('be.disabled')
        })

        it('custom button performs action only on checked row', () => {
            const spy = cy.spy()
            Cypress.vue.$on('clone', spy)
            cy.get('[data-cy=r0-cbuttonCheckbox]')
                .check()

            cy.get('[data-cy=clone-button]')
            .click()
            .then(() => {
                expect(spy).to.be.calledWith([1]) // returns an array of the row's ID
                // custom button events are handled on the page side so no action is performed
            })
        })

        it('delete button disabled when no checkboxes are checked', () => {
            cy.get('[data-cy=delete-button]')
                .should('be.disabled')
        })

        it('delete button deletes only one row when one checkbox is checked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-deleted', spy)
            cy.get('[data-cy=r0-cbuttonCheckbox]')
                .check()

            cy.get('[data-cy=delete-button]')
            .click()
            cy.on('window:confirm', (text) => {
                expect(text).to.contains('Would you like to delete the selected log(s)?');
            })
            .then(() => {
                expect(spy).to.be.calledWith([1]) // returns an array of the row's ID
                // Deletion is handled on the page side so nothing is acutally deleted
            })
        })

        it('delete button disabled when no checkboxes are checked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-deleted', spy)
            cy.get('[data-cy=delete-button]')
                .should('be.disabled')
            cy.get('[data-cy=r0-cbuttonCheckbox]')
                .check()
            cy.get('[data-cy=delete-button]')
            .should('be.enabled')
            cy.get('[data-cy=r0-cbuttonCheckbox]')
                .uncheck()
            cy.get('[data-cy=delete-button]')
                .should('be.disabled')
        })

        it('disables the delete buttons when a row is being edited', () => {
            cy.get('[data-cy=r0-cbuttonCheckbox]')
                .check()
            cy.get('[data-cy=delete-button]')
                .should('be.enabled')

            cy.get('[data-cy=r0-edit-button]')
                .click()
            cy.get('[data-cy=delete-button]')
                .should('be.disabled')
        })

        it('emits an event when the edit button is clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('edit-clicked', spy)
            cy.get('[data-cy=r0-edit-button]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith()
                })
        })

        // Same object call problem as the other save 
        it('emits with an empty object payload when a cell gets changed back during editing', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-edited', spy)
            cy.get('[data-cy=r0-edit-button]')
                .click()

            cy.get('[data-cy=r0-Item-input]')
                .clear()
                .type('Bomber Jacket')
                .clear()
                .type('Joggers')

            cy.get('[data-cy=r0-save-button]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith({"Item": 'Joggers'}, 1)
                })
        })
    })

    context('Cancel button tests', () => {
        let prop = {
            rows: [            
                {id: 1, data: ['1', 'Shirt', 'S', 'Green', 5, '2020-01-01', true]},
                {id: 2, data: ['5', 'Pants', 'L', 'Blue', 12, '2020-05-01', true]},
                {id: 3, data: ['9', 'Hat', 'M', 'Black', 8, '2020-03-01', false]}
            ],
            columns: [
                {"header": "ID", "visible": true, "inputType": {'type': 'no input'}},
                {"header": 'Item', "visible": true, "inputType": {'type': 'text'}},
                {"header": 'Size', "visible": false, "inputType": {'type': 'dropdown','value': ['S', 'M', 'L']}},
                {"header": 'Color', "visible": true, "inputType": {'type': 'dropdown','value': ['Green', 'Blue', 'Black', 'Red']}},
                {"header": 'Count', "visible": true, "inputType": {'type': 'regex', 'regex': '^[1-9]+[0-9]*$'}},
                {"header": 'Date', "visible": true, "inputType": {'type': 'date'}},
                {"header": "Purchased", "visible": true, "inputType": {'type': 'boolean'}},
            ],
            customButtons: [
                {"hoverTip": 'Clone', "visible": true, "inputType": {'type': 'button', 'value': 'glyphicon glyphicon-asterisk', 'buttonClass': 'table-button btn btn-warning', 'event': 'clone'}},
                ],
            canDelete: true,
            canEdit: true,
            csvName: "unitTest_"
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            })  
        })

        it('cancel button is there when a row is being edited', () => {
            cy.get('[data-cy=r0-edit-button')
                .click()

            cy.get('[data-cy=r0-cancel-button]')
                .should('exist')
            cy.get('[data-cy=r1-cancel-button]')
                .should('not.exist')
        })

        it('cancel button should undo changes made by editing', () => {
            cy.get('[data-cy=r0-edit-button')
                .first().click()

            cy.get('[data-cy=r0-Item-input]')
                .clear()
                .type('Hello there!')
            
            cy.get('[data-cy=r0-cancel-button]')
                .click()

            cy.get('[data-cy=r0-Item]')
                .should('have.text', 'Shirt')
        })

        it('Header change when editing', () => {
            cy.get('[data-cy=edit-header')
                .should('exist')
            cy.get('[data-cy=save-header')
                .should('not.exist')

            cy.get('[data-cy=r0-edit-button')
                .click()
            
            cy.get('[data-cy=edit-header')
                .should('not.exist')
            cy.get('[data-cy=save-header')
                .should('exist')
        })

        it('cancel button emits an event', () => {
            const spy = cy.spy()
            Cypress.vue.$on('edit-canceled', spy)
            cy.get('[data-cy=r0-edit-button')
                .click()

            cy.get('[data-cy=r0-cancel-button]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith()
                })
        })
    })

    context('with different input types', () => {
        let prop= {
            rows: [            
                {id: 1, data: ['1', 'Shirt', 'S', 'Green', 5, '2020-01-01', true]},
                {id: 2, data: ['5', 'Pants', 'L', 'Blue', 12, '2020-05-01', true]},
                {id: 3, data: ['9', 'Hat', 'M', 'Black', 8, '2020-03-01', false]}
            ],
            columns: [
                {"header": "ID", "visible": true, "inputType": {'type': 'no input'}},
                {"header": 'Item', "visible": true, "inputType": {'type': 'text'}},
                {"header": 'Size', "visible": false, "inputType": {'type': 'dropdown','value': ['S', 'M', 'L']}},
                {"header": 'Color', "visible": true, "inputType": {'type': 'dropdown','value': ['Green', 'Blue', 'Black', 'Red']}},
                {"header": 'Count', "visible": true, "inputType": {'type': 'regex', 'regex': '^[1-9]+[0-9]*$'}},
                {"header": 'Date', "visible": true, "inputType": {'type': 'date'}},
                {"header": "Purchased", "visible": true, "inputType": {'type': 'boolean'}},
            ],
            customButtons: [
                {"hoverTip": 'Clone', "visible": true, "inputType": {'type': 'button', 'value': 'glyphicon glyphicon-asterisk', 'buttonClass': 'table-button btn btn-warning', 'event': 'clone'}},
                ],
            canDelete: true,
            canEdit: true,
            csvName: "unitTest_"
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            }) 
        })

        it('correct input types are provided', () => {
            cy.get('[data-cy=r0-edit-button]')
                .click()

            cy.get('[data-cy=r0-ID]') // This is a no-input
                .should("exist")
            cy.get('[data-cy=r0-Item-input]')
                .should("exist")
            cy.get('[data-cy=r0-Size-input]')
                .should("not.exist")  // not visible
            cy.get('[data-cy=r0-Color-input]')
                .should("exist")    
            cy.get('[data-cy=r0-Count-input]')
                .should("exist")
            cy.get('[data-cy=r0-Date-input]')
                .should("exist")
            cy.get('[data-cy=r0-Purchased-input]')
                .should("exist")
        })

        it('allows you to type in a text field', () => {
            cy.get('[data-cy=r0-edit-button]')
                .click()

            cy.get('[data-cy=r0-Item-input]')
                .clear()
                .type('Testing')

            cy.get('[data-cy=r0-save-button]')
                .click()

            cy.get('[data-cy=r0-Item')
                .should('contain','Testing')
        })
    
        it('allows you to select from a dropdown', () => {
            cy.get('[data-cy=r0-edit-button]')
                .click()
            
            cy.get('[data-cy=r0-Color-input]')
                .select('Black')
            
            cy.get('[data-cy=r0-save-button]')
                .click()
            
            cy.get('[data-cy=r0-Color]')
                .should('have.text','Black')
        })

        it('regex only allows inputs corresponding to its regex string', () => {
            // In this example, the regex string only allows positive ints
            cy.get('[data-cy=r0-edit-button]')
                .click()

            cy.get('[data-cy=r0-Count-input] > [data-cy=text-input]')
                .clear()
                .type('12.5')
                .blur()

            cy.get('[data-cy=r0-save-button]')
                .should("be.disabled")

            cy.get('[data-cy=r0-Count-input] > [data-cy=text-input]')
                .clear()
                .type('2')
                .blur()

            cy.get('[data-cy=r0-save-button]')
                .click()

            cy.get('[data-cy=r0-Count]')
                .should('have.text','2')
        })
        
        it('allows you to specify a date in a date input', () => {
            cy.get('[data-cy=r0-edit-button]')
                .click()

            cy.get('[data-cy=r0-Date-input]')
                .type('2020-05-14')

            cy.get('[data-cy=r0-save-button]')
                .click()

            cy.get('[data-cy=r0-Date')
                .should('have.text','2020-05-14')
        })

        it('allows you to check and uncheck only while editing', () => {
            cy.get('[data-cy=r0-Purchased-input]')
                .should('be.disabled')

            cy.get('[data-cy=r0-edit-button]')
                .click()

            cy.get('[data-cy=r0-Purchased-input]')
                .should('be.enabled')
                .uncheck()

            cy.get('[data-cy=r0-save-button]')
                .click()

            cy.get('[data-cy=r0-Purchased-input')
                .should('not.be.checked')
        })
    })

    context('Delete button pop up and event tests', () => {
        let prop= {
            rows: [            
                {id: 1, data: ['1', 'Shirt', 'S', 'Green', 5, '2020-01-01', true]},
                {id: 2, data: ['5', 'Pants', 'L', 'Blue', 12, '2020-05-01', true]},
                {id: 3, data: ['9', 'Hat', 'M', 'Black', 8, '2020-03-01', false]}
            ],
            columns: [
                {"header": "ID", "visible": true, "inputType": {'type': 'no input'}},
                {"header": 'Item', "visible": true, "inputType": {'type': 'text'}},
                {"header": 'Size', "visible": false, "inputType": {'type': 'dropdown','value': ['S', 'M', 'L']}},
                {"header": 'Color', "visible": true, "inputType": {'type': 'dropdown','value': ['Green', 'Blue', 'Black', 'Red']}},
                {"header": 'Count', "visible": true, "inputType": {'type': 'regex', 'regex': '^[1-9]+[0-9]*$'}},
                {"header": 'Date', "visible": true, "inputType": {'type': 'date'}},
                {"header": "Purchased", "visible": true, "inputType": {'type': 'boolean'}},
            ],
            customButtons: [
                {"hoverTip": 'Clone', "visible": true, "inputType": {'type': 'button', 'value': 'glyphicon glyphicon-asterisk', 'buttonClass': 'table-button btn btn-warning', 'event': 'clone'}},
                ],
            canDelete: true,
            canEdit: true,
            csvName: "unitTest_"
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            }) 
        })

        it('OK" is clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-deleted', spy)

            cy.get('[data-cy=r0-cbuttonCheckbox]')
                .check()

            cy.get('[data-cy=delete-button]')
                .click()

            cy.on("window:confirm", () => true)
            cy.wait(100)
            .then(() => {
                expect(spy).to.be.calledWith([1]) // the row id to be deleted
                // Note: No handler for the event so row is not
                // actaully deleted.
            })
        })

        it('confirms that row is not deleted if "cancel" is clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-deleted', spy)

            cy.get('[data-cy=r0-cbuttonCheckbox]')
                .check()

            cy.get('[data-cy=delete-button]')
                .click()

            cy.on("window:confirm", () => false)
            
            cy.wait(100).then(() => { 
                expect(spy).to.not.be.called
            })
        })
    })

    context('export csv file', () => {
        const downloadsFolder = '/home/fd2dev/fd2test/cypress/downloads/'
        let comp;
        beforeEach(() => {
            comp = mount(CustomTableComponent, {
                propsData: {
                    rows: [            
                        {id: 1, data: ['1', 'Shirt', 'S', 'Green', 5, '2020-01-01', true]},
                        {id: 2, data: ['5', 'Pants', 'L', 'Blue', 12, '2020-05-01', true]},
                    ],
                    columns: [
                        {"header": "ID", "visible": true, "inputType": {'type': 'no input'}},
                        {"header": 'Item', "visible": true, "inputType": {'type': 'text'}},
                        {"header": 'Size', "visible": false, "inputType": {'type': 'dropdown','value': ['S', 'M', 'L']}},
                        {"header": 'Color', "visible": true, "inputType": {'type': 'dropdown','value': ['Green', 'Blue', 'Black', 'Red']}},
                        {"header": 'Count', "visible": true, "inputType": {'type': 'regex', 'regex': '^[1-9]+[0-9]*$'}},
                        {"header": 'Date', "visible": true, "inputType": {'type': 'date'}},
                        {"header": "Purchased", "visible": true, "inputType": {'type': 'boolean'}},
                    ],
                    csvName: "unitTest_"
                }
            })
        })

        it('assure the button exists', () => {
            cy.get('[data-cy=export-button')
            .should('have.exist')
        })

        it('assure the button cannot be clicked when no row is selected', () => {
            
            cy.get('[data-cy=export-button')
            .should('have.exist')
            .should("be.disabled")
        })

        it('verifying download', () => {
            var today = new Date()
            var dd = String(today.getDate()).padStart(2, '0')
            var mm = String(today.getMonth() + 1).padStart(2, '0')
            var yyyy = today.getFullYear()
            today = mm + dd + yyyy

            cy.get('[data-cy=r0-cbuttonCheckbox]')
                .click()
            cy.get('[data-cy=export-button]')
                .click();

            cy.readFile(downloadsFolder + 'unitTest_' + today + '.csv').should("exist")
            cy.exec("rm -r " + downloadsFolder)
        })

        it('verifies only one row was downloaded into csv', () => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0')
            var mm = String(today.getMonth() + 1).padStart(2, '0') 
            var yyyy = today.getFullYear()
            today = mm + dd + yyyy

            cy.get('[data-cy=r0-cbuttonCheckbox]')
            .click()
            cy.get('[data-cy=export-button]')
                .click()

            cy.readFile(downloadsFolder + 'unitTest_' + today + '.csv')
                .should("exist")
                .should("eq", "ID,Item,Color,Count,Date,Purchased\n1,Shirt,Green,5,2020-01-01,true\n\n")
            cy.exec("rm -r " + downloadsFolder)
        })

        it('verifies all rows were downloaded into csv', () => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0')
            var mm = String(today.getMonth() + 1).padStart(2, '0') 
            var yyyy = today.getFullYear()
            today = mm + dd + yyyy
            cy.get('[data-cy=selectAll-checkbox]')
            .click()
            cy.get('[data-cy=export-button]')
                .click();

            cy.readFile(downloadsFolder + 'unitTest_' + today + '.csv')
                .should("exist")
                .should("eq", "ID,Item,Color,Count,Date,Purchased\n1,Shirt,Green,5,2020-01-01,true\n5,Pants,Blue,12,2020-05-01,true\n")
            cy.exec("rm -r " + downloadsFolder)
        })
    })
})