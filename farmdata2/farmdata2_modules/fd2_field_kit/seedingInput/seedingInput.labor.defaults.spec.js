describe('Test the labor input section', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-field-kit/seedingInput')
    }) 

    it("Check header", () => {
        cy.get("[data-cy='labor-header']")
            .should("have.text", "Labor")
    })
    
    it("Checks Worker input test", () => {
        cy.get("[data-cy='num-worker-input'] > [data-cy=text-input]")
            .should('have.value', '')
        cy.get("[data-cy='num-worker-input'] > [data-cy=text-input]")
            .should('have.prop', 'disabled', false)
    })

    it("Checks Time worked input test", () => {
        cy.get("[data-cy='minute-input'] > [data-cy=text-input]")
            .should('have.value', '')
        cy.get("[data-cy='minute-input'] > [data-cy=text-input]")
            .should('have.prop', 'disabled', false)
    })

    it("Checks unit dropdown selection activates correct selected time unit", () => {
        //check minute-input
        cy.get("[data-cy='time-unit'] > [data-cy='dropdown-input']")
            .select("minutes")
        cy.get("[data-cy='minute-input']").should("be.visible")
        cy.get("[data-cy='hour-input']").should("not.be.visible")

        //check hour-input
        cy.get("[data-cy='time-unit'] > [data-cy='dropdown-input']")
            .select("hours")
        cy.get("[data-cy='hour-input']").should("be.visible")
        cy.get("[data-cy='minute-input']").should("not.be.visible")
    })

    it("Checks Time units dropdown", () => {
        cy.get("[data-cy='time-unit'] > [data-cy='dropdown-input'] > [data-cy='option0']")
            .should('have.value', 'minutes')
        cy.get("[data-cy='time-unit'] > [data-cy='dropdown-input'] > [data-cy='option1']")
            .should('have.value', 'hours')
    })

    it("Checks Time units default is minutes", () => {
        cy.get("[data-cy='time-unit'] > [data-cy='dropdown-input']")
            .find('option:selected').should("have.text", "minutes")
    })
})
