/**
 * The tests in this file show how to create new seeing logs, delete 
 * seeding logs and modify existing seeding logs.
 */
const dayjs = require('dayjs')

var FarmOSAPI = require('../../resources/FarmOSAPI.js')
var deleteRecord = FarmOSAPI.deleteRecord
var getSessionToken = FarmOSAPI.getSessionToken
var createRecord = FarmOSAPI.createRecord

describe('Example of creating and deleting seeding logs in a test', () => {

    /*
     * We are going to be modifying the database so we will need a session token.
     * We will also be using the session token in multiple tests (its). So we define 
     * a variable here that will be set in the beforeEach().
     */
     let sessionToken = null

    beforeEach(() => {
        // Log in
        cy.login("manager1", "farmdata2")
        .then (() => {
            cy.wrap(getSessionToken()).as("get-token")
        })

        cy.get("@get-token").then((token) => {
            sessionToken = token
        })

        cy.visit("/farm/fd2-example/dbTest")
        cy.waitForPage()
    })

    /**
     * A context allows us to have a beforeEach and an afterEach just for this test.
     * 
     * The beforeEach in the context will run before the it in the context.  It can be used
     * to create a log that is used for testing.
     * 
     * The afterEach in the context will run after the it in the context. It can be used 
     * it to delete any logs that were created for the test or during the test.
     */
    context("Create a new log, do some tests, delete the log(s) ", () => {

        let logID = null

        /**
         * This beforeEach will run before the it in this context.  It is used to 
         * create a new log. The id of the log is saved in the logID variable 
         * declared in the context so that it can be deleted in the afterEach.
         */
        beforeEach(() => {
            cy.wrap(makeDirectSeeding("Test Seeding")).as("make-seeding")
            //cy.wrap(makeDirectSeeding("Test Seeding")).as("make-seeding")

            cy.get("@make-seeding")
            .then((response) => {
                logID = response.data.id            
            })
        })

        /**
         * Do your testing in this it.
         */
        it("Do your test using the new log(s) here.", () => {
            /*
             * This test can be changed to expect(true).to.equal(true)
             * in order to check that the record is still deleted by the
             * afterEach() even if the test fails.
             */
            expect(true).to.equal(true)
        })

        /**
         * Delete the log created in the beforeEach so that the database
         * is back to where it started.
         */
        afterEach(() => {
            cy.wrap(deleteRecord("/log/"+logID, sessionToken)).as("delete-seeding")
            cy.get("@delete-seeding")
        })
    })

    /**
     * This function will return a promise that creates a new Direct Seeding log.
     */
    function makeDirectSeeding(name) {
        let json = {
            "name": name,
            "type": "farm_seeding",
            "timestamp": dayjs("1999-01-01").unix(),
            "done": "1",  //any seeding recorded is done.
            "notes": {
                "value": "This is a test direct seeding",
                "format": "farm_format"
            },
            "asset": [{ 
                "id": "6",   //Associated planting
                "resource": "farm_asset"
            }],
            "log_category": [{
                "id": "240",
                "resource": "taxonomy_term"
            }],
            "movement": {
                "area": [{
                    "id": "180",
                    "resource": "taxonomy_term"
                }]
            },
            "quantity": [
                {
                    "measure": "length", 
                    "value": "10",  //total row feet
                    "unit": {
                        "id": "20", 
                        "resource": "taxonomy_term"
                    },
                    "label": "Amount planted"
                },
                {
                    "measure": "ratio", 
                    "value": "20",
                    "unit": {
                        "id": "38",
                        "resource": "taxonomy_term"
                    },
                    "label": "Rows/Bed"
                },
                {
                    "measure": "time", 
                    "value": "1.23", 
                    "unit": {
                        "id": "29",
                        "resource": "taxonomy_term"
                    },
                    "label": "Labor"
                },
                {
                    "measure": "count", 
                    "value": "30", 
                    "unit": {
                        "id": "15",
                        "resource": "taxonomy_term"
                    },
                    "label": "Workers"
                },
            ],
            "created": dayjs().unix(),
            "lot_number": "N/A (No Variety)",
            "data": "{\"crop_tid\": \"161\"}"
        }       

        return createRecord('/log', json, sessionToken)
    }

    /**
    * This function will return a promise that creates a new Tray Seeding log.
    */
    function makeTraySeeding(name) {
        let json = {
            "name": name,
            "type": "farm_seeding",
            "timestamp": dayjs("1999-01-01").unix(),
            "done": "1",  //any seeding recorded is done.
            "notes": {
                "value": "This is a test tray seeding",
                "format": "farm_format"
            },
            "asset": [{ 
                "id": "6",   //Associated planting
                "resource": "farm_asset"
            }],
            "log_category": [{
                "id": "241",
                "resource": "taxonomy_term"
            }],
            "movement": {
                "area": [{
                    "id": "180",
                    "resource": "taxonomy_term"
                }]
            },
            "quantity": [
                {
                    "measure": "count", 
                    "value": "10",  //number of seed planted
                    "unit": {
                        "id": "17", 
                        "resource": "taxonomy_term"
                    },
                    "label": "Seeds planted"
                },
                {
                    "measure": "count", 
                    "value": "20",  //number of flats(trays)
                    "unit": {
                        "id": "12", 
                        "resource": "taxonomy_term"
                    },
                    "label": "Flats used"
                },
                {
                    "measure": "ratio", 
                    "value": "30",  //cells per flat
                    "unit": {
                        "id": "37",
                        "resource": "taxonomy_term"
                    },
                    "label": "Cells/Flat"
                },
                {
                    "measure": "time", 
                    "value": "1.23",  //hours worked
                    "unit": {
                        "id": "29",
                        "resource": "taxonomy_term"
                    },
                    "label": "Labor"
                },
                {
                    "measure": "count", 
                    "value": "40",
                    "unit": {
                        "id": "15",
                        "resource": "taxonomy_term"
                    },
                    "label": "Workers"
                },
            ],
            "created": dayjs().unix(),
            "lot_number": "N/A (No Variety)",
            "data": "{\"crop_tid\": \"161\"}"
        }       

        return createRecord('/log', json, sessionToken)
    }
})