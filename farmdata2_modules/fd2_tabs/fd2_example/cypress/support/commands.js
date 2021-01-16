Cypress.Commands.add("login", (user, password) => {
  cy.request({
    method: 'POST',
    url: '/user/login',
    form: true,
    body: {
      name: user,
      pass: password,
      form_id: 'user_login'
    }
  })
});
