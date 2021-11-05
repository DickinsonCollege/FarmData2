describe('Tests for the example sub-tab', () => {
  beforeEach(() => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-example/ex1', {timeout: 120000})

    //requires that the area dropdown contain ALF-1 before continuing the test
    //This will ensure that all api requests have finished before the test starts
    cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
        cy.get($dropdowns[0]).contains('ALF-1', {timeout: 130000})
    })
  })

  it('Text field content is linked to header', () => {
    cy.get('[data-cy=comment-field]')
      .clear()
      .type('Hello Farm!')

    cy.get('[data-cy=comment]')
      .should('have.text','Hello Farm!')
  })
 
  it('API call for farm name works', () => {
    cy.get('[data-cy=get-name-button]')
      .click()

    cy.get('[data-cy=farm-name]')
      .should('have.text','Sample Farm')
  })
  //example of using a context to break tests up into sections
  context('Tests for Components', () => {
    it('Areas dropdown component is working', () => {
        cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
            .select("All")
        cy.get('[data-cy=selected-area]').should('have.text', 'All')

        cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
            .select("ALF-1")
        cy.get('[data-cy=selected-area]').should('have.text', 'ALF-1')

        cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
            .select("V")
        cy.get('[data-cy=selected-area]').should('have.text', 'V')
    })

    it('Crops dropdown component is working', () => {
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
            .select("All")
        cy.get('[data-cy=selected-crop]').should('have.text', 'All')

        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
            .select("ARUGULA")
        cy.get('[data-cy=selected-crop]').should('have.text', 'ARUGULA')

        //we only got the first 100 crops, so Zucchini should not be in the dropdown
        cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
            .should("not.contain","ZUCCHINI")
    })

    it('Date selection component is working', () => {
        cy.get('[data-cy=date-picker] > [data-cy=date-select]')
            .type('2021-06-05')
            .blur()
        cy.get('[data-cy=selected-date]').should('have.text', '2021-06-05')
    })

    it('Date range selection component is working', () => {
        cy.get('[data-cy=start-date-select] > [data-cy=date-select]')
            .type('2021-06-05')
            .blur()
        cy.get('[data-cy=start-date]').should('have.text', '2021-06-05')

        cy.get('[data-cy=end-date-select] > [data-cy=date-select]')
            .type('2021-06-10')
            .blur()
        cy.get('[data-cy=end-date]').should('have.text', '2021-06-10')
    })

    it('Check table headers', () => {
        cy.get('[data-cy=headers]')
            .first().should('have.text', 'cool')
            .next().should('have.text', 'works?')
            .next().should('have.text', 'num')
            .next().should('have.text', 'hello')

        cy.get('[data-cy=edit-header]').should('exist')
        cy.get('[data-cy=delete-header]').should('exist')
    })
  })
})
