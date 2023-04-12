/**
 * The tests in this file show how to get a map from the FarmOSAPI and
 * use it in tests.  This can be useful when the one of the maps is 
 * needed to translate between ids and names in a test (e.g. from 
 * crop id to crop name or vice versa).
 */

/** 
 * Tests that interact with the database will often make use of the
 * Functions in the FarmOSAPI library to access and modify the database.
 * 
 * The lines below illustrate how functions from the FarmOSAPI library
 * can be brought into a spec.js file for testing.
 * 
 * The farmdata2/README.md contains information about the documentation 
 * for all of the functions in the FarmOSAPI library.
 */
var FarmOSAPI = require('../../resources/FarmOSAPI.js')
var getUserToIDMap = FarmOSAPI.getUserToIDMap

describe('Example of getting a map to via the FarmOSAPI functions in a test', () => {

    /*
     * If multiple tests in the same describe will be using the userToIDMap
     * then define a variable, like userMap here, and set it in the beforeEach 
     * as illustrated below.  This variable will then be accessible in all of the
     * tests (its).
     * 
     * If the map is only needed in a single test (it) then the same approach can
     * be used within that test (it) and this variable will not be necessary.
     */
    let userMap = null

    beforeEach(() => {
        // Log in
        cy.login("manager1", "farmdata2")
        .then (() => {

            /*
             * Once we are logged in we can Use the getUserToIDMap() function from the FarmOSAPI library 
             * to get the map.
             * 
             * The getUserToIDMap() function makes an API call to farmOS to get the data and create the map.
             * This function returns a promise that resolves to the map when the API call returns.
             * 
             * The map will not be available until the promise returned by the getUserToIDMap()
             * resolves. So we need to wait for that promise to resolve. 
             * The cy.wrap(...).as(...) command is how we setup to wait for a promise to resolve in Cypress.
             * 
             * The name "get-map" used here is just an identifier that describes what we are waiting on.
             * It is used below when we actually wait for the promise to resolve.
             */
            cy.wrap(getUserToIDMap()).as("get-map")
        })

        /*
         * We use cy.get(...).then(...) in Cypress to wait for a promise that has
         * been wrapped to resolve.
         * 
         * Here we wait for the promise wrapped as "get-map" above.
         */
        cy.get("@get-map")
        .then((map) => {
            /*
             * The parameter map will be set to the map from the promise.  Here we assign
             * it to the userMap variable so that it will be accessible to all of the it 
             * tests.
             */
            userMap = map
        })
        
        // Visit the page that will be tested. 
        cy.visit("/farm/fd2-example/dbTest")

                /*
         * Almost always the page being visited will load maps and other
         * content in its created() hook.  If the page follows the pattern
         * used in FarmData2 pages (see Maps.html for an example with explanation)
         * then this causes the tests to wait here until the entire page and
         * all of its data is loaded before continuing.
         */
        cy.waitForPage()
    })

    /**
     * All tests can then use the userToIDMap that was assigned to the 
     * userMap variable in the beforeEach.
     */
    it("Use the map in a test", () => {

        /*
         * The tests can then use the userMap in tests.
         * 
         * The expect(...) function is like the .should(...) statement.  While
         * .should(...) is used to make assertions about elements found with cy.get(...),
         * expect(...) is used to make assertions about variables.
         * 
         * For every assertion that can be made with .should(...) there is an equivalent
         * assertion for use with expect(...).  For a complete reference see:
         * https://docs.cypress.io/guides/references/assertions
         */
        expect(userMap).to.not.be.null
        expect(userMap.get("manager1")).to.equal("3")
        expect(userMap.get("worker1")).to.equal("5")
    })
})