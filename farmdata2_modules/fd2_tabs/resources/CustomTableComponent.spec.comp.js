import {mount} from '@cypress/vue'
import { shallowMount } from '@vue/test-utils'

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
            cy.get('[data-cy=table]')
                .should('exist')
        })

        it('Displays headers in first row', () => {
            cy.get('[data-cy=h0]').should('have.text', 'cool')
            cy.get('[data-cy=h1]').should('have.text', 'works?')
            cy.get('[data-cy=h2]').should('have.text', 'hello')

        })

        it('displays all objects in table', () => {
            cy.get('[data-cy=r0c0]').should('have.text', '12')
            cy.get('[data-cy=r0c1]').should('have.text', '3')
            cy.get('[data-cy=r0c2]').should('have.text', 'answome')

            cy.get('[data-cy=r1c0]').should('have.text', '19')
            cy.get('[data-cy=r1c1]').should('have.text', '3')
            cy.get('[data-cy=r1c2]').should('have.text', 'and')

            cy.get('[data-cy=r2c0]').should('have.text', '12')
            cy.get('[data-cy=r2c1]').should('have.text', '12')
            cy.get('[data-cy=r2c2]').should('have.text', 'answome12')
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

            cy.get('[data-cy=r0c0]').should('have.text', '5')
            cy.get('[data-cy=r0c1]').should('have.text', '10')
            cy.get('[data-cy=r0c2]').should('have.text', 'Wahooo')
        })
        
        it('renders HTML elements found in strings', () => {
            prop.rows[0].data = [ 5, 10, '<p>html baby!</p>' ]
            cy.get('[data-cy=r0c2]').should('have.text', 'html baby!')
        })
    })

    context('with edit and delete button', () => {
        let prop = {
            rows: [
                {id: 10, data: [12, 3, 'answome']},
                {id: 11, data: [19, 3, 'and'],},
                {id: 12, data: [12, 12, 'answome12'],},
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
            cy.get('[data-cy=edit-button-r0]')
                .should('exist')
                .click()

            cy.get('[data-cy=text-input-r0c0]')
                .clear()
                .type('hey')

            cy.get('[data-cy=save-button-r0]')
                .should('exist')
                .click()

            cy.get('[data-cy=r0c0]')
                .should('have.text', 'hey')
        })

        it('save button emits changes when clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-edited', spy)
            cy.get('[data-cy=edit-button-r0]')
                .click()

            cy.get('[data-cy=text-input-r0c0]')
                .clear()
                .type('yo')

            cy.get('[data-cy=save-button-r0]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith({cool: 'yo'}, 10)
                })
        })

        it('delete button emits deleted row id when clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-deleted', spy)
            cy.get('[data-cy=delete-button-r1]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith(11)
                })
        })

        it('only one row is editable at a time', () => {
            cy.get('[data-cy=edit-button-r2]')
            .click()

            cy.get('[data-cy=edit-button-r0]')
                .should('be.disabled')
            cy.get('[data-cy=edit-button-r1]')
                .should('be.disabled')
        })

        it('disables the delete buttons when a row is being edited', () => {
            cy.get('[data-cy=edit-button-r1]')
            .click()

            cy.get('[data-cy=delete-button-r0]')
                .should('be.disabled')
            // r1 delete button is now a cancel button.
            cy.get('[data-cy=delete-button-r2]')
                .should('be.disabled')
        })

        it('emits an event when the edit button is clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('edit-clicked', spy)
            cy.get('[data-cy=edit-button-r0]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith()
                })
        })

        it('emits with an empty object payload when a cell gets changed back during editing', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-edited', spy)
            cy.get('[data-cy=edit-button-r0]')
                .click()

            cy.get('[data-cy=text-input-r0c2]')
                .clear()
                .type('not-answome')
                .clear()
                .type('answome')

            cy.get('[data-cy=save-button-r0]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith({}, 10)
                })
        })
    })

    context('Cancel button tests', () => {
        let prop = {
            rows: [
                {id: 10, data: [12, 3, 'answome']},
                {id: 11, data: [19, 3, 'and'],},
                {id: 12, data: [12, 12, 'answome12'],},
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

        it('cancel button is there when a row is being edited', () => {
            cy.get('[data-cy=edit-button-r0')
                .click()

            cy.get('[data-cy=cancel-button-r0]')
                .should('exist')
            cy.get('[data-cy=cancel-button-r1]')
                .should('not.exist')
        })

        it('Cancel button should undo changes made by editing', () => {
            cy.get('[data-cy=edit-button-r1')
                .first().click()

            cy.get('[data-cy=text-input-r1c1]')
                .clear()
                .type('hey')
            
            cy.get('[data-cy=cancel-button-r1]')
                .click()

            cy.get('[data-cy=r1c1]')
                .should('have.text', 3)
        })

        it('Header change when editing', () => {
            cy.get('[data-cy=edit-header')
                .should('exist')
            cy.get('[data-cy=delete-header')
                .should('exist')
            cy.get('[data-cy=save-header')
                .should('not.exist')
            cy.get('[data-cy=cancel-header')
                .should('not.exist')

            cy.get('[data-cy=edit-button-r0')
                .click()
            
            cy.get('[data-cy=edit-header')
                .should('not.exist')
            cy.get('[data-cy=delete-header')
                .should('not.exist')
            cy.get('[data-cy=save-header')
                .should('exist')
            cy.get('[data-cy=cancel-header')
                .should('exist')
        })

        it('cancel button emits an event', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-canceled', spy)
            cy.get('[data-cy=edit-button-r0')
                .click()

            cy.get('[data-cy=cancel-button-r0]')
                .click()
                .then(() => {
                    expect(spy).to.be.calledWith()
                })
        })
    })

    context('with invisible columns', () => {
        let prop= {
            rows: [ {id: 10, data: [12, 3, 'answome']},
                    {id: 11, data: [19, 3, 'and'],},
                    {id: 12, data: [15, 12, 'answome12'],}, ],
            headers: ['cool', 'works?', 'hello'],
            visibleColumns: [true, false, true],
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            }) 
        })

        it('only headers with corresponsing true property', () => {
            cy.get('[data-cy=table-headers]')
                .children()
                .first()
                .should('have.text','cool')
                .next()
                .should('have.text','hello')
        })

        it('only displays colums with corresponsing true property', () => {
            // need to test this way because columns are still
            // numbered in r0c0, r0c1, r0c2 even if c1 is not 
            // displayed.
            cy.get('[data-cy=r0]')  // <tr>
                .children()         // all <td>s
                .first()            // first <td>
                .children()         // <td> contents
                .first()            // <span>
                .should('have.text','12')
                .parent()           // <td>
                .parent()           // <tr>
                .children()         // all <td>s
                .next()             // second <td>
                .children()         // <td> contents
                .first()            // span
                .should('have.text','answome')
        })
    })

    context('with different input types', () => {
        let prop= {
            rows: [
                { id: 10, data: ['fixed', 'edit', 3, 'Yes', '2020-01-01'] }
            ],
            headers: ['None', 'Text', 'Number', 'Dropdown', 'Date'],
            canEdit: true,
            inputOptions: [
                {'type': 'no input'},
                {'type': 'text'},
                {'type': 'number'},
                {'type': 'dropdown', 'value': ['Yes', 'No']},
                {'type': 'date'}
            ]
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            }) 
        })

        it('correct input types are provided', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()

            cy.get('[data-cy=r0c0]')
                .should("exist")
            cy.get('[data-cy=text-input-r0c1]')
                .should("exist")
            cy.get('[data-cy=number-input-r0c2]')
                .should("exist")
            cy.get('[data-cy=dropdown-input-r0c3]')
                .should("exist")
            cy.get('[data-cy=date-input-r0c4]')
                .should("exist")
        })

        it('allows you to type in a text field', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()

            cy.get('[data-cy=text-input-r0c1]')
                .clear()
                .type('hey')

            cy.get('[data-cy=save-button-r0]')
                .click()

            cy.get('[data-cy=r0c1')
                .should('contain','hey')
        })

        it('only allows you to pick numbers in a number input', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()

            cy.get('[data-cy=number-input-r0c2]')
                .clear()
                .type('12345abcde')

            cy.get('[data-cy=save-button-r0]')
                .click()

            cy.get('[data-cy=r0c2]')
                .first()
                .should('have.text','12345')
        })

        it('allows you to select from a dropdown', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()

            cy.get('[data-cy=dropdown-input-r0c3]')
                .select('No')

            cy.get('[data-cy=save-button-r0]')
                .click()

            cy.get('[data-cy=r0c3]')
                .should('have.text','No')
        })

        it('allows you to specify a date in a date input', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()

            cy.get('[data-cy=date-input-r0c4]')
                .type('2020-05-14')

            cy.get('[data-cy=save-button-r0]')
                .click()

            cy.get('[data-cy=r0c4')
                .should('have.text','2020-05-14')
        })
    })

    context('Delete button pop up and event tests', () => {
        let prop= {
            rows: [ {id: 10, data: [12, 3, 'answome']},
                    {id: 11, data: [19, 3, 'and'],},
                    {id: 12, data: [12, 12, 'answome12'],}, 
            ],
            headers: ['cool', 'works?', 'hello'],
            canDelete: true,
        }

        beforeEach(() => {
            mount(CustomTableComponent, {
                propsData: prop
            }) 
        })

        it('OK" is clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-deleted', spy)
            cy.get('[data-cy=delete-button-r1]')
                .click()

            cy.on("window:confirm", () => true)
            cy.wait(100)
            .then(() => {
                expect(spy).to.be.calledWith(11)
                // Note: No handler for the event so row is not
                // actaully deleted.
            })
        })

        it('confirms that row is not deleted if "cancel" is clicked', () => {
            const spy = cy.spy()
            Cypress.vue.$on('row-deleted', spy)
            cy.get('[data-cy=delete-button-r1]')
                .click()

            cy.on("window:confirm", () => false)
            
            cy.wait(100).then(() => { 
                expect(spy).to.not.be.called
            })
        })
    })

    context('watch prop changes', () => {
        let comp;
        beforeEach(() => {
            // shallowMount to test prop changes
            comp = shallowMount(CustomTableComponent, {
                propsData: {
                    rows: [ {id: 10, data: [12, 3, 'answome']},
                    {id: 11, data: [19, 3, 'and'],},
                    {id: 12, data: [12, 12, 'answome12'],}, 
                    ],
                    headers: ['cool', 'works?', 'hello'],
                    canDelete: true,
                    visibleColumns: [true, true, false],
                }
            })
        })

        it('checking prop changes for visibleColumns', () => {
            // deep equal to compare key value pairs instead of references
            expect(comp.vm.visibleColumns).to.deep.equal([true, true, false])
            cy.wrap(comp.setProps({ visibleColumns: [false, true, false]}))
            .then(() => {
                //checking both prop and the computed property
                expect(comp.vm.visibleColumns).to.deep.equal([false, true, false])
                expect(comp.vm.isVisible).to.deep.equal([false, true, false])
            })
        })

        it('checking prop changes for visibleColumns to null then back to a non-null array', () => {
            // deep equal to compare key value pairs instead of references
            expect(comp.vm.visibleColumns).to.deep.equal([true, true, false])
            cy.wrap(comp.setProps({ visibleColumns: null}))
            .then(() => {
                // checking both prop and the computed property
                expect(comp.vm.visibleColumns).to.deep.equal(null)          // prop is passed in as null
                expect(comp.vm.isVisible).to.deep.equal([true, true, true]) // computed property is set as an array of trues when null is passed as arg
                cy.wrap(comp.setProps({ visibleColumns: [false, true, true]}))
                .then(() => {
                    // now going back to a non-null array
                    expect(comp.vm.visibleColumns).to.deep.equal([false, true, true]) 
                    expect(comp.vm.isVisible).to.deep.equal([false, true, true])
                })
            })    
        })

        it('checking prop changes for visibleColumns when the element is directly modified', () => {
            expect(comp.vm.visibleColumns).to.deep.equal([true, true, false])
            cy.wrap(comp.vm.visibleColumns[0] = false)
            cy.wrap(comp.vm.visibleColumns[2] = true)
            .then(() => {
                expect(comp.vm.visibleColumns).to.deep.equal([false, true, true])
                expect(comp.vm.isVisible).to.deep.equal([false, true, true])
            })
        })
    })

    context('export csv file', () => {
        const path = require("path");
        const downloadsFolder = 'cypress/downloads'
        let comp;
        beforeEach(() => {
            comp = mount(CustomTableComponent, {
                propsData: {
                    rows: [ {id: 10, data: [12, 3, 'answome']},
                    {id: 11, data: [19, 3, 'and'],},
                    {id: 12, data: [12, 12, 'answome12'],}, 
                    ],
                    headers: ['cool', 'works?', 'hello'],
                    canDelete: true,
                    visibleColumns: [true, true, false],
                }
            })
        })

        it('assure the button exists', () => {
            cy.get('[data-cy=export-btn')
            .should('have.exist')
        })

        it('verifies download', () => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); 
            var yyyy = today.getFullYear();
            today = mm + dd + yyyy;
            cy.get('[data-cy=export-btn]')
                .click();

            cy.readFile(path.join(downloadsFolder, 'seedingReport_' + today + '.csv')).should("exist");

        });

        it('verifies content of csv', () => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); 
            var yyyy = today.getFullYear();
            today = mm + dd + yyyy;
            cy.get('[data-cy=export-btn]')
                .click();

            cy.readFile(path.join(downloadsFolder, 'seedingReport_' + today + '.csv')).should("eq", "cool,works?\n12,3\n19,3\n12,12");
            cy.exec("cd " + downloadsFolder + ' ' + "&& rm -rf *")
        });
    })
})