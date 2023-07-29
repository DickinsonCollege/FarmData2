const allExpectedHeaders = [
  { "header": 'Date'},
  { "header": 'Crop'},
  { "header": 'Area'},
  { "header": 'Seeding'},
  { "header": 'Row Feet'},
  { "header": 'Bed Feet'},
  { "header": 'Rows/Bed'},
  { "header": 'Seeds'},
  { "header": 'Trays'},
  { "header": 'Cells/Tray'},
  { "header": 'Workers'},
  { "header": 'Hours'},
  { "header": 'Varieties'},
  { "header": 'Comments'},
  { "header": 'User'},
];

describe("Test the seeding report columns by seeding type", () => {
  beforeEach(() => {

    cy.login('manager1', 'farmdata2')
    cy.visit('/farm/fd2-barn-kit/seedingReport')

    // Wait here for the maps to load in the page.
    cy.waitForPage()

    //first generate a report
    cy.get('[data-cy=start-date-select]').type('2020-01-01')
    cy.get('[data-cy=end-date-select]').type('2020-07-01')
    cy.get('[data-cy=generate-rpt-btn]')
      .click()
  })

  it('Checks the Report Table header for the "all" option', () => {
    cy.get('[data-cy=report-table]')
      .should('exist')
      
    // Check to see if the checkboxes are visible and enabled
    cy.get("[data-cy=r1-cbuttonCheckbox]").should('not.be.disabled')
    cy.get("[data-cy=r1-cbuttonCheckbox]").should('be.visible')

    //Make sure these headers exist on the page and the rest are not
    let includedHeaders = ["Date", "Crop", "Area", "Seeding", "Workers", "Hours", "Varieties", "Comments", "User"]
    let i = 0
    allExpectedHeaders.forEach(header => {
      if (includedHeaders.includes(header.header)) {
        cy.get("[data-cy=h" + i + "]").should('exist')
      } else {
        cy.get("[data-cy=h" + i + "]").should('not.exist')
      }
      i++
    })
    
    cy.get('[data-cy=r1-edit-button]').should('exist');
  });

  it("Tests the direct seeding columns", () => {
    cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]').select('Direct Seedings')
    
    cy.get('[data-cy=report-table]')
      .should('exist')

    cy.get("[data-cy=r1-cbuttonCheckbox]").should('not.be.disabled')
    cy.get('[data-cy=selectAll-checkbox]').should('be.visible');

    //Make sure these headers exist on the page and the rest are not
    let includedHeaders = ["Date", "Crop", "Area", "Seeding", "Row Feet", "Bed Feet", "Rows/Bed", 
    "Workers", "Hours", "Varieties", "Comments", "User"]
    let i = 0
    allExpectedHeaders.forEach(header => {
      if (includedHeaders.includes(header.header)) {
        cy.get("[data-cy=h" + i + "]").should('exist')
      } else {
        cy.get("[data-cy=h" + i + "]").should('not.exist')
      }
      i++
    })

    cy.get('[data-cy=r1-edit-button]').should('exist');
  });

  it("Tests the tray seeding columns", () => {
    cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]').select('Tray Seedings')

    cy.get('[data-cy=report-table]')
      .should('exist')

    cy.get("[data-cy=r1-cbuttonCheckbox]").should('not.be.disabled')
    cy.get('[data-cy=selectAll-checkbox]').should('be.visible');

    //Make sure these headers exist on the page and the rest are not
    let includedHeaders = ["Date", "Crop", "Area", "Seeding", "Seeds", "Trays", "Cells/Tray", "Workers", "Hours", "Varieties", "Comments", "User"]
    let i = 0
    allExpectedHeaders.forEach(header => {
      if (includedHeaders.includes(header.header)) {
        cy.get("[data-cy=h" + i + "]").should('exist')
      } else {
        cy.get("[data-cy=h" + i + "]").should('not.exist')
      }
      i++
    })

    cy.get('[data-cy=r1-edit-button]').should('exist');
  });
});
