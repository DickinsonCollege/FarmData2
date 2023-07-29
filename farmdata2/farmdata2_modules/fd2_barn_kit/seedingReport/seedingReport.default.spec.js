const dayjs = require('dayjs')
describe('eTest Seeding Report Default', () => {
  beforeEach(() => {
    cy.login("manager1", "farmdata2")
    cy.visit("/farm/fd2-barn-kit/seedingReport")
  })

  it("Check start and end date with current year", () => {
    cy.get("[data-cy = date-range-selection] > [data-cy = end-date-select] > [data-cy = date-select]")
      .should('have.value', dayjs().format("YYYY-MM-DD"))
    cy.get("[data-cy = date-range-selection] > [data-cy = start-date-select] > [data-cy = date-select]")
      .should('have.value', dayjs().format("YYYY-01-01"))
  })

  it("The report table shouldn't be visible", () => {
    cy.get("[data-cy = report-table]").should("not.exist")
  })

  it("Check that the page contains header", () => {
    cy.get("[data-cy=report-header]").should("have.text", "Seeding Report")
  })

  it("Test the generate button", () => {
    cy.get('[data-cy=generate-rpt-btn]').should("have.text", "Generate Report")
    cy.get('[data-cy=generate-rpt-btn]').should("be.enabled")
  })
  
  it("Test to make sure that there is a section labeled Set Dates", () => {
    cy.get("[data-cy=date-selection-header]").should("have.text", "Set Dates")
  })
})

