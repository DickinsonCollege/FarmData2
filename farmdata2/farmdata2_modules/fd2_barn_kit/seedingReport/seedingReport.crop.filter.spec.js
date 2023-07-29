/**
 * The crop dropdown in the Seeding Report allows the user to filter the crops that appear 
 * in the generated table. This spec tests that when the table is generated that if the 
 * option "All" is selected that multiple crops will be allowed to appear in the table 
 * and that when one of the crop options is selected then only that crop will appear in 
 * the table. This spec will also test that only the crops that appear in the selected date 
 * range, and "All", will be options in the crop dropdown.
 */
describe("Test that the crop filter in the Seeding Report works as intended", () => {
    beforeEach(() => {
        cy.login("manager1", "farmdata2")
        cy.visit("/farm/fd2-barn-kit/seedingReport")
        cy.waitForPage()
    })

    it("Tests that the dropdown for the crop filter only contains the crops that exist in the given date range", () => {
        cy.get('[data-cy=start-date-select]').type('2019-07-06')
        cy.get('[data-cy=end-date-select]').type('2019-07-12')
        cy.get('[data-cy=generate-rpt-btn]').click()
        //There should be four options: the three crops in this date range and the "All" option.
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').children().should("have.length", 4)
        //the first option in the drop down should be "All"
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input] > [data-cy=option0]').should('have.value', 'All') 
        //the second option in the drop down should be "BROCCOLI"
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input] > [data-cy=option1]').should('have.value', 'BROCCOLI') 
        //the third option in the drop down should be "CAULIFLOWER"
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input] > [data-cy=option2]').should('have.value', 'CAULIFLOWER')  
        //the fourth, and final, option in the drop down should be "KOHLRABI"
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input] > [data-cy=option3]').should('have.value', 'KOHLRABI') 
    })

    /**
     * The test below will check that when the All option is selected,
     * the seeding report table will contain several different crops.
     * First, the table should have 6 rows, and the length has been validated.
     * Next, the crops variable is a list of crops which should appear in the table.
     * The cropsRegex variable uses regex to combine the expected crops
     * into a list which can act as an "or" statement when .contains() is used.
     * This will check that a crop value existing in our table is expected.
     * Thus, for each row in the table, the crop value is checked
     * using its data-cy attribute to validate that the crop exists in
     * the list of expected crops, and that there are several unique crops.
     */
    it("Tests that when 'All' crops are selected, the table will have seeding logs for several crops", () => {
        cy.get('[data-cy=start-date-select]').type('2019-07-06')
        cy.get('[data-cy=end-date-select]').type('2019-07-12')
        cy.get('[data-cy=generate-rpt-btn]').click()
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('have.value', 'All')
        cy.get('[data-cy=table-body]').children().should('have.length', 6)
        const crops = ['KOHLRABI', 'BROCCOLI', 'CAULIFLOWER']
        const cropsRegex = new RegExp(`${crops.join('|')}`, 'g')
        for(let i = 0; i < 6; i++)
        {
            cy.get('[data-cy=td-r'+i+'c1]').contains(cropsRegex)
        }
    })

    it("Tests that when a specific crop is selected, the table will have only the seeding logs for that crop", () => {
        //Selecting date range 07/06/2019 - 07/12/2019
        cy.get('[data-cy=start-date-select]').type('2019-07-06')
        cy.get('[data-cy=end-date-select]').type('2019-07-12')
        cy.get('[data-cy=generate-rpt-btn]').click()
        //Selecting CAULIFLOWER in the crops dropdown menu:
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').select('CAULIFLOWER')
        //checking to ensure CAULIFLOWER is selected in the dropdown menu:
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('have.value', 'CAULIFLOWER')
        //checking that only 3 logs exist in the table:
        cy.get('[data-cy=table-body]')
        .children()
        .should('have.length', 3)
        //Check that only logs pertaining to CAULIFLOWER exist in the table
        for(let i = 0; i < 3; i++){
            cy.get('[data-cy=r'+i+"-Crop]")
            .should('have.text', 'CAULIFLOWER')
        }
    })
})