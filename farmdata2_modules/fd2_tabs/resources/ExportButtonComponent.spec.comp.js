import {mount} from '@cypress/vue'

var ExpoButton = require("./ExportButtonComponent.js")
var ExportButtonComponent = ExpoButton.ExportButtonComponent

describe('export button component', () => {
    context('headers and rows display in the csv correctly', () => {
        let prop= {
            headers: ['cool', 'works?', 'hello'],
            rows: [ {id: 10, data: [12, 3, 'answome']},
                    {id: 11, data: [19, 3, 'and'],},
                    {id: 12, data: [12, 12, 'answome12'],}, ],
        }

        beforeEach(() => {
            mount(ExportButtonComponent, {
                propsData: prop
            }) 
        })

        it.only('the export button exists', () => {
            cy.get('[data-cy=download-btn]')
                .should('exist')
        })

        it('the headers appear in the csv correctly', () => {

        })

        it('the rows appear in the csv correctly', () => [

        ])
    })
    context('viable columns work correclty in csv', () => {

    })
    context('extra data given to the export button component displays correcty', () => {

    })
})