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
 * This command works with a pattern in the page to wait for 
 * api calls initiated in the created() method to complete.
 * 
 * To use this command the page should contain the following:
 * 
 * The <div>:
 *   <div data-cy="page-loaded" v-show=false>{{ pageLoaded }}</div>
 * 
 * The data element:
 *   createdCount: 0,
 * 
 * A computed function where the value in the comparison (e.g. 1) 
 * is determined by the number of api calls to wait for:
 *   pageLoaded() {
 *     return this.createdCount == 1
 *   },
 * 
 * In the created() method, in a then() associated with each API call
 * include the line:
 *   this.createdCount++
 * 
 * See the fd2_example/vars/vars.html and fd2_example/api/api.html pages
 * for some examples.
 */
Cypress.Commands.add("waitForPage", () => {
  cy.get('[data-cy=page-loaded]').should('have.text','true')
})

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