describe('Tests for the example sub-tab', () => {
  beforeEach(() => {
    cy.login('worker1', 'farmdata2')
    cy.visit('/farm/fd2-example/ex1')
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
      .should('have.text','Dickinson College Farm')
  })

  it('Fields dropdown component is working', () => {
    cy.get('[data-cy=field-dropdown] > [data-cy=dropdown-input]')
        .select("All")
    cy.get('[data-cy=selected-field]').should('have.text', 'All')

    cy.get('[data-cy=field-dropdown] > [data-cy=dropdown-input]')
        .select("ALF 1")
    cy.get('[data-cy=selected-field]').should('have.text', 'ALF 1')

    cy.get('[data-cy=field-dropdown] > [data-cy=dropdown-input]')
        .select("V")
    cy.get('[data-cy=selected-field]').should('have.text', 'V')
  })

  it('Crops dropdown component is working', () => {
    cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
        .select("All")
    cy.get('[data-cy=selected-crop]').should('have.text', 'All')

    cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
        .select("Arugula")
    cy.get('[data-cy=selected-crop]').should('have.text', 'Arugula')

    cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
        .select("Zucchini")
    cy.get('[data-cy=selected-crop]').should('have.text', 'Zucchini')
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
        .next().should('have.text', 'hello')

    cy.get('[data-cy=edit-header]')
    cy.get('[data-cy=delete-header]')
  })
})
