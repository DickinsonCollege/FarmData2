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

Cypress.Commands.add("logout", () => {
    cy.request({
        method: 'POST',
        url: '/user/logout',
        form: true,
        body: {
        }
    })
});