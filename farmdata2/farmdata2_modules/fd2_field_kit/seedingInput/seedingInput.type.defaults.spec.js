
/**
 * The seeding type selection section of the Seeding Input Log allows the user to select 
 * the appropriate type of seeding, either tray seeding or direct seeding, for their log. 
 * This spec tests that both of these options are enabled, that neither of these options 
 * are selected by default, that a message is visible directing the user to select either 
 * the Tray or Direct type, and that the form elements for Tray and Direct are not visible
 * unless their respective option has been selected.
 */

describe("Test the seeding input type default values in the Seeding Input Log", () => {
    beforeEach(() => {
        cy.login("manager1", "farmdata2")
        cy.visit("/farm/fd2-field-kit/seedingInput")
    })
      
    it("Tests whether Tray and Direct elements are enabled", () => {
        cy.get("[data-cy='tray-seedings']").should('be.enabled')
        cy.get("[data-cy='direct-seedings']").should('be.enabled')
    })

    it("Tests that neither the Tray nor the Direct element is selected, and a message to prompt the selection of either element is visible", () => {
        cy.get("[data-cy='tray-seedings']").should('not.be.selected')
        cy.get("[data-cy='direct-seedings']").should('not.be.selected')
        cy.get("[data-cy='seeding-type-prompt']").should('be.visible')
    })

    it("Tests that the form elements for Tray or Direct are not visible until clicked", () => {
        //check form elements in tray seeding - should not be visible until tray radio button clicked
        cy.get("[data-cy='tray-area-selection']").should('not.be.visible')
        cy.get("[data-cy='num-cell-input']").should('not.be.visible')
        cy.get("[data-cy='num-tray-input']").should('not.be.visible')
        cy.get("[data-cy='num-seed-input']").should('not.be.visible')
        ///check form elements in direct seeding - should not be visible until direct radio button clicked
        cy.get("[data-cy='direct-area-selection']").should('not.be.visible')
        cy.get("[data-cy='num-rowbed-input']").should('not.be.visible')
        cy.get("[data-cy='unit-feet']").should('not.be.visible')
        cy.get("[data-cy='num-feet-input']").should('not.be.visible')
    })
})
