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
 * Cypress clears the local storage between tests.  This work around
 * can be used to copy the local storge at the end of each test 
 * (i.e. in an afterEach) and then resore it at the start of the 
 * the next test (i.e. in a beforeEach).
 * 
 * This work around was created by Michal Pietraszko (pietmichal on GitHub):
 * https://github.com/cypress-io/cypress/issues/461#issuecomment-392070888
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