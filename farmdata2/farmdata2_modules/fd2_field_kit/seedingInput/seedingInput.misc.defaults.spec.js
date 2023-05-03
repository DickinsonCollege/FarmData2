/**
 * This file test some default contents of the Seeding Input Form in the FieldKit tab.
 */
describe('Test Seeding Input Miscellaneous Defaults', () =>{
    beforeEach(()=>{
        cy.login("manager1", "farmdata2")
        cy.visit('/farm/fd2-field-kit/seedingInput')
    })

    it("Check that the SUBMIT button is disabled", () => {
        cy.get("[data-cy=submit-button]").should("be.disabled")
    })

    it('Test the comment text box is empty and enabled', ()=>{
        cy.get("[data-cy=comments").should("be.empty")
        cy.get("[data-cy=comments").should('not.be.disabled')
    })

    it('Test the Submit button box is labeled', ()=>{
        cy.get("[data-cy=submit-button]").should("have.text","Submit").should('be.visible')
    })
    
    it("Check that the page has a header", () => {
        cy.get("[data-cy=header]").should("have.text", "Seeding Input Log")
    })

    it("Check that the section has a label comment", () => {
        cy.get("[data-cy=comments-label]").should("have.text","Comments")
        cy.get("[data-cy=comments-label]").should("be.visible")     
    })

})
