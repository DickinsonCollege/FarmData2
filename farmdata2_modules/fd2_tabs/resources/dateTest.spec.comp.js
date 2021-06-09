import { mount } from "@cypress/vue"
import DateTest from "./dateTest.js"

describe('DateTest', () => {
    it('testing YeeHaw!', () => {
        mount(DateTest, {

        })
        cy.get('[data-cy=header]')
            .should('exist')
    })
}) 