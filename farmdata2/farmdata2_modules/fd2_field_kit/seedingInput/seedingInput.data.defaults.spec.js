const dayjs = require('dayjs')

describe("Test Data section of Seeding Input form", () =>{


    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-field-kit/seedingInput')
    }) 

    it("Checks the Data header", () => {
        cy.get("[data-cy=data-header").should('have.text',"Data")
    })
      
    it("Checks the Date input defaults", () => {
        cy.get("[data-cy=date-selection").should('not.be.disabled')
        cy.get('[data-cy=date-selection] input[type=date]').should('be.visible').should('have.value', dayjs().format('YYYY-MM-DD'));
    })

    it("Checks the crop-dropdown defaults", ()=>{
        cy.waitForPage()
        
        cy.get("[data-cy=crop-selection] > [data-cy=dropdown-input]").should("not.be.disabled")
        cy.get("[data-cy=crop-selection] > [data-cy=dropdown-input]").should('have.value', null)
        cy.get("[data-cy=crop-selection] > [data-cy=dropdown-input] > [data-cy=option0").should("have.text","ARUGULA")
        cy.get("[data-cy=crop-selection] > [data-cy=dropdown-input] > [data-cy=option110").should("have.text","ZUCCHINI")
        cy.get("[data-cy=crop-selection] > select").find("option").should("have.length", 111);
    })
})