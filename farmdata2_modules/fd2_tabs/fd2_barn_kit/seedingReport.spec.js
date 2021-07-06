it('Info tab of the barn kit exists and has content', () => {
  cy.login('manager1', 'farmdata2')
  cy.visit('/farm/fd2-barn-kit/seedingReport')
})