describe('Field and Crop Dropdowns', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/cropAndFieldPickersTesting')
        
    })
    it('accepts input from search bar', () => {
        cy.get('[data-cy=dropdown-input]')
            .type('Beans')
            .should('have.value', 'Beans')
    })
 
    it('contains the right crops', () => {
        cy.get('[data-cy=singleOption]')
            .first().should('have.text', 'All')
            .next().should('have.text', 'Corn')
            .next().should('have.text', 'Beans')
            .next().should('have.text', 'Peas')
    })

    it('includes the all option when the attribute is included', () => {
        //figure out how to include test that determines if it has the attribute 'includesAll'
        cy.get('[data-cy=singleOption]')
            .first().should('have.text', 'All')
    })
})