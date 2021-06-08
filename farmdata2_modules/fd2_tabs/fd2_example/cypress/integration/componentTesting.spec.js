describe('Field and Crop Dropdowns', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/cropAndFieldPickersTesting')
        
    })
    context('Crop Dropdown', () => {
        it('accepts input from search bar', () => {
            cy.get('[data-cy=crop-picker-input]')
                .type('Beans')
                .should('have.value', 'Beans')
        })

        it.only('contains the right crops', () => {
            cy.get('[data-cy=crop-picker-options]')
                .first().should('have.text', 'All')
                .then().should('have.text', 'Corn')
                .then().should('have.text', 'Beans')
                .then().should('have.text', 'Peas')
        })

        it('includes the all option when the attribute is included', () => {
            //test that it has the attribute 'includesAll'
            cy.get('[data-cy=crop-picker-options]')
                .first().should('have.text', 'All')
        })

        /**
         *         it('populates search bar when an option is selected', () => {
            cy.get('[data-cy=crop-picker-input]')
                .type('Beans')
            cy.get('[data-cy=crop-picker-options]')
                .first().should('have.text', 'Beans')
                .next().should('have.text', 'Soybeans')
        })
         */

        /**
         * it.only('updates the selectedCrop when an option is selected', () => {
            cy.get('[data-cy=crop-picker-input]')
                .type('Beans')
                .should('have.value', 'Beans')
            cy.get('[data-cy=crop-picker-component]')
                .should('have.data', 'selectedCrop')
        })
         */
        
    })
    context('Field Dropdown', () => {
        it('accepts input from search bar', () => {
            cy.get('[data-cy=field-picker-input]')
                .type('Jasmine-1')
                .should('have.value', 'Jasmine-1')
        })

        it('includes "all" option when the attribute is included', () => {
            //test that it has the attribute 'includesAll'
            cy.get('[data-cy=crop-picker-options]')
                .first().should('have.text', 'All')
        })
    })
})
