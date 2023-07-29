const dayjs = require('dayjs')

describe("Testing Transplanting Report in BarnKit", () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-barn-kit/transplantingReport')
    })

    it("Check page and table header" ,() => {
        cy.get("[data-cy = report-header]").should("have.text", "Transplanting Report")
        cy.get("[data-cy = table-header]").should("have.text", "Set Dates")
    })

    it("The report table shouldn't be visible", () => {
        cy.get("[data-cy = report-table]").should("not.exist")
    })

    it("Check generate button functionality", () => {
        cy.get("[data-cy = generate-rpt-btn]").should("have.text", "Generate Report")
        cy.get("[data-cy = generate-rpt-btn]").should("be.enabled")
    })

    it("Check start and end date with current year", () => {
        cy.get("[data-cy = date-range-selection] > [data-cy = end-date-select] > [data-cy = date-select]")
        .should('have.value',dayjs().format("YYYY-MM-DD"))
        cy.get("[data-cy = date-range-selection] > [data-cy = start-date-select] > [data-cy = date-select]")
        .should('have.value',dayjs().format("YYYY-01-01"))
    })
})