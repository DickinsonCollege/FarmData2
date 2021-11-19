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

/**
 * This work around was created by @bkucera
 */
let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});