import {mount} from '@cypress/vue'

var ExpoButton = require("./ExportButtonComponent.js")
var ExportButtonComponent = ExpoButton.ExportButtonComponent

describe('export button component', () => {
    context('props that should but dont work', () => {
        beforeEach(() => {
            mount(ExportButtonComponent, {
                propsData: {
                    headers: ['cool', 'works?', 'hello'],
                    rows: [ {id: 10, data: [12, 3, 'answome']},
                            {id: 11, data: [19, 3, 'and'],},
                            {id: 12, data: [12, 12, 'answome12'],}, ],
                }
            }) 
        })
        it('export button exists', () =>{
            cy.get('[data-cy=download-btn')
                .should('exist')
        })
    })
    context('headers and rows display in the csv correctly', () => {
        beforeEach(() => {
            mount(ExportButtonComponent, {
                propsData: {
                    headers: ['cool', 'works?', 'hello'],
                    rows: [ {id: 10, data: []},
                            {id: 11, data: [],},
                            {id: 12, data: [],}, ],
                }
            }) 
        })

        it('the export button exists', () => {
            cy.get('[data-cy=download-btn]')
                .should('exist')
        })

        it.only('the headers appear in the csv correctly', () => {
            cy.get('[data-cy=download-btn]').should('exist')
                .click()
        })

        it('the rows appear in the csv correctly', () => [

        ])
    })
    context('viable columns work correclty in csv', () => {

    })
    context('extra data given to the export button component displays correcty', () => {

    })
})