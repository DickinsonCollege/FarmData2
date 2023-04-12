/**
 * The tests in this file illustrate how to get seeding logs from 
 * the database using the functions in the FarmOSAPI library and then
 * make assertions about their contents.
 */

/*
 * The dayjs library can be imported into a test using the following
 * line. This is particularly useful for conversions between dates
 * and time stamps.
 */
const dayjs = require('dayjs')

var FarmOSAPI = require("../../resources/FarmOSAPI.js")
var getRecord = FarmOSAPI.getRecord
var getAllPages = FarmOSAPI.getAllPages

describe("Examples of getting seeding logs via the FarmOSAPI functions in a test", () => {

    beforeEach(() => {
        cy.login("manager1", "farmdata2")

        /*
         * Load any maps (see dbtest.maps.spec) or get a session token
         * (see dbtest.sessionToken.spec.js) as necessary here.
         */
    
        cy.visit("/farm/fd2-example/dbTest")
        cy.waitForPage()
    })

    /**
     * If you have the id of a log it can be retrieved using the getRecord
     * function from the FarmOSAPI library.
     */
    it("Get a seeding log by its id", () => {

        /*
         * Request the log with id=6.  This is a direct seeding of Radish in 
         * CHUAU-2 on February 04, 2019. 
         */
        cy.wrap(getRecord("/log.json?id=6")).as("get-log")

        /*
         * Wait for the promise returned from getRecord to resolve.
         */
        cy.get("@get-log")
        .then((response) => {

            /*
             * Once the response is received we can make assertions about the values
             * in the response to verify that it is as expected.
             * 
             * To know the structure and content of the log it is helpful to access
             * the URL in a browser or through a tool such as Hoppscotch or postman
             * and inspect the JSON directly.
             */
            expect(response.data.list[0].movement.area[0].name).to.equal("CHUAU-2")
            expect(response.data.list[0].type).to.equal("farm_seeding")
            expect(response.data.list[0].log_category[0].name).to.equal("Direct Seedings")
        })
    })

    /**
     * If you want all of the logs in a date range, they can be retrieved
     * using the getAllPAges function from the FarmOSAPI library.
     */
    it("Get all of the seeding logs in a date range", () => {

        // Get the start and end timestamps for the date range we want.
        let start = dayjs("2020-05-01","YYYY-MM-DD").unix()
        // Add 1 day here to get to the end of May 5th.
        let end = dayjs("2020-05-05","YYYY-MM-DD").add(1,'day').unix()

        /*
         * Request all of the farm seedings between 2020-05-01 and 2020-05-05. There
         * were 14 seeding in this date range.
         */
        let url = "/log.json?type=farm_seeding&timestamp[gt]="+start+"&timestamp[lt]="+end
        let seedingLogs = []
        cy.wrap(getAllPages(url, seedingLogs)).as("get-logs")

        /*
         * Wait for the promise returned from getAllPages to resolve.
         */
        cy.get("@get-logs")
        .then((response) => {
          
            /*
             * Once the response is received we can make assertions about the values 
             * in the array that was filled with the results to verify that they are 
             * as expected.
             * 
             * To know the structure and content of the array it is helpful to access
             * the URL in a browser or through a tool such as Hoppscotch or postman
             * and inspect the JSON directly.
             */

            expect(seedingLogs.length).to.equal(14)
        })
    })
})