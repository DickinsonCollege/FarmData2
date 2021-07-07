describe('Testing for the seeding report page', () => {
    it('visits the page and logs in', () => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-barn-kit/seedingReport')
    })

    it('allows user input of the start and end dates', () => {
        cy.get('[data-cy=date-range-selection]')
            .should('exist')

        cy.get('[data-cy=start-date-select]')
            .should('exist')
            .type('2019-01-01')

        cy.get('[data-cy=end-date-select]')
            .should('exist')
            .type('2019-05-01')
            
        /**cy.get('[data-cy=date-select]')
            .each(($el, index, $all) => {
                if (index == 0) {
                    expect($el).to.have.value('2019-01-01')
                }
                else if (index == 1){
                    expect($el).to.have.value('2019-05-01')
                }
            })*/
    })

    it('generate report button renders the rest of the page', () => {
        cy.get('[data-cy=generate-rpt-btn]')
            .click()
    })
})