/**
 * Any test that modify the database (create logs, modify logs, delete logs)
 * will need to have a session token. The session token ensures that the user 
 * has permission to modify the database.
 * 
 * The sample code in this file illustrates how tests can get a session token. 
 */

var FarmOSAPI = require("../../resources/FarmOSAPI.js")
var getSessionToken = FarmOSAPI.getSessionToken

describe("Illustration of how to get a session token.", () => {

    /*
     * If multiple tests in the same describe will be using the FarmOSAPI functions
     * to modify the database then define a variable here and set it in the 
     * beforeEach as illustrated below.
     */
    let sessionToken = null;

    beforeEach(() => {
        // Log in as a user with permissions to modify the database.
        cy.login("manager1", "farmdata2")
        .then(() => {
            /*
             * Once we are logged in, use the  getSessionToken() function from the 
             * FarmOSAPI library makes an API call to farmOS to get a session token 
             * as the logged in user.
             * 
             * The cy.wrap(...).as(...) allows us to wait (just below) for the 
             * API request for the session token to complete before we continue and
             * try to use the sessionToken variable.  
             * 
             * The name "get-token" is just an identifier for the wrap that we will use
             * below when we wait for the API call to complete.
             */
            cy.wrap(getSessionToken()).as("get-token")
        })

        /*
         * This cy.get uses the name "get-token" from the cy.wrap above to wait here
         * until the session token is returned from the API request. When the session
         * token is returned it is assigned to the sessionToken variable defined above.
         */
        cy.get("@get-token").then((token) => {
            sessionToken = token
        })

        // Visit the page that will be tested. 
        cy.visit("/farm/fd2-example/dbTest")
        cy.waitForPage()
    })

    /**
     * Any it can then use the sessionToken variable to modify the database.
     */
    it("Check that the sessionToken variable is not null", () => {
        /*
         * The tests would then use the sessionToken in calls to the functions
         * in the FarmOSAPI library as needed.  The examples in the other .spec.js
         * files in this module illustrate those use cases.
         * 
         * Here we test that the sessionToken variable is not null just to show
         * that it was set.
         */
        expect(sessionToken).to.not.be.null
    })
})