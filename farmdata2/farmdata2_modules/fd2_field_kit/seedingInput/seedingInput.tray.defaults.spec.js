describe('Test the tray seeding ', () => {
    beforeEach(() => {
        cy.login("manager1", "farmdata2")
        cy.visit('/farm/fd2-field-kit/seedingInput')
       })

    it("Check the tray seeding section when 'Tray' is selected ", () => {
        cy.get ("[data-cy=tray-seedings]").check()
        cy.get("[data-cy=tray-selection]").should("be.visible")})

    it("Check the dropdown Area ", () => {
        cy.get ("[data-cy=tray-seedings]").check()
        cy.get("[data-cy=tray-area-selection]>[data-cy=dropdown-input]").should("be.visible")
        cy.get("[data-cy=tray-area-selection]>[data-cy=dropdown-input]").should("not.be.disabled")
        cy.get("[data-cy=tray-area-selection]>[data-cy=dropdown-input]").should("have.value",null)
    })

    it("Test area dropdown", () => {
        cy.get("[data-cy=tray-seedings]").check()
        cy.get("[data-cy=tray-area-selection] > [data-cy=dropdown-input] > [data-cy=option0")
        .should("have.value", "CHUAU")
        cy.get("[data-cy=tray-area-selection] > [data-cy=dropdown-input] > [data-cy=option2")
        .should("have.value", "JASMINE")
        cy.get("[data-cy=tray-area-selection] > [data-cy=dropdown-input] > [data-cy=option4")
        .should("have.value", "SEEDING BENCH")
    })

    it("Test cells/tray field", () => {
        cy.get("[data-cy=tray-seedings]").check()
        cy.get("[data-cy=num-cell-input]")
        .should("be.visible")
        cy.get("[data-cy=num-cell-input] > [data-cy=text-input]")
        .should("not.be.disabled")
        .should("be.empty")
    })

    it("Check tray field", () => {
        cy.get("[data-cy=num-tray-input]").should("not.visible");
        cy.get("[data-cy=tray-seedings]").click();
        cy.get("[data-cy=num-tray-input] > [data-cy=text-input]").should("be.visible")
                                        .should("not.be.disabled")
                                        .should("have.value","")
    });

    it("Check seed field", () => {
        cy.get("[data-cy=num-seed-input] ").should("not.be.visible");
        cy.get("[data-cy=tray-seedings]").click();
        cy.get("[data-cy=num-seed-input] > [data-cy=text-input]").should("be.visible")
                                        .should("not.be.disabled")
                                        .should("have.value", "")
    });
})