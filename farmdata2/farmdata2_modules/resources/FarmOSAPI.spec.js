var FarmOSAPI = require("./FarmOSAPI.js")

var getAllPages = FarmOSAPI.getAllPages
var getSessionToken = FarmOSAPI.getSessionToken
var updateRecord = FarmOSAPI.updateRecord
var createRecord = FarmOSAPI.createRecord
var deleteRecord = FarmOSAPI.deleteRecord
var getRecord = FarmOSAPI.getRecord

var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration

var getIDToUserMap = FarmOSAPI.getIDToUserMap
var getIDToCropMap = FarmOSAPI.getIDToCropMap
var getIDToAreaMap = FarmOSAPI.getIDToAreaMap
var getIDToUnitMap = FarmOSAPI.getIDToUnitMap
var getIDToLogTypeMap = FarmOSAPI.getIDToLogTypeMap

var getUserToIDMap = FarmOSAPI.getUserToIDMap
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var getAreaToIDMap = FarmOSAPI.getAreaToIDMap
var getUnitToIDMap = FarmOSAPI.getUnitToIDMap
var getLogTypeToIDMap = FarmOSAPI.getLogTypeToIDMap

var quantityLocation = FarmOSAPI.quantityLocation

describe('API Request Functions', () => {
    beforeEach(() => {
        // Login as restws1, which is a user that can make api requests.
        cy.login('restws1', 'farmdata2')
    })

    context('getAllPages API request function', () => {
        it('Test on a request with a one page response.', () => {

            let requests=0
            let testArray = []

            cy.intercept('GET',/log\?type=farm_seeding/, (req) => {
                requests++  // count requests made on this route.
            })
            .then(() => {
                // wrap and alias the getAllPages here.
                // It returns a promise that resolves when all pages have been
                // fetched into the array.
                cy.wrap(getAllPages('/log?type=farm_seeding&id[le]=50', testArray))
                .as('done')
            })

            // Wait here for all pages to be fetched.
            cy.get('@done')
            .then(() => {
                expect(requests).to.equal(1)
                expect(testArray).to.have.length(50)
            })
        })

        it('Test on a request with multiple pages', () => {
            let firstCalls=0
            let secondCalls=0
            let lastCalls=0
            let testArray = []

            cy.intercept("GET","/log?type=farm_seeding&page=5", (req) => {
                firstCalls++
            })
            cy.intercept("GET","/log?type=farm_seeding&page=6", (req) => {
                secondCalls++
            })
            cy.intercept("GET","/log?type=farm_seeding&page=9", (req) => {
                lastCalls++
            })
            .then(() => {
                cy.wrap(getAllPages("/log?type=farm_seeding&page=5", testArray))
                .as('done')
            })

            cy.get('@done').should(() => {
                expect(firstCalls).to.equal(1)
                expect(secondCalls).to.equal(1)
                expect(lastCalls).to.equal(1)
                expect(testArray).to.have.length.gt(400)
            })
        })

        it('check that data property is parsed', () => {
            let cropToIDMap
            cy.wrap(getCropToIDMap()).as('cropMap')
            cy.get('@cropMap').then((theMap) => {
                cropToIDMap = theMap
            })

            //let testArray
            cy.wrap(getAllPages('/log?type=farm_seeding&id[le]=150'))
                .as('done')

            // Wait here for all pages to be fetched.
            cy.get('@done')
            .then((array) => {
                // check log from first page of response.
                expect(array[0].data.crop_tid).to.equal(cropToIDMap.get("ASPARAGUS"))
                // check log from second page of response.
                expect(array[149].data.crop_tid).to.equal(cropToIDMap.get("RADISH-DAIKON"))
            })
        })

        it('check that data is not parsed if not present', () => {
            // Assets do not have data properties so this fails
            // if that isn't handled properly
            cy.wrap(getAllPages('/farm_asset?type=planting&id[le]=75'))
            .as('done')

            // Wait here for all pages to be fetched.
            cy.get('@done')
            .then((array) => {
                expect(array[0].data).to.be.null
                expect(array[74].data).to.be.null
            })
        })

        it('failed request', () => {
            cy.intercept('GET', '/fail',
                // stub an error response so it looks like the request failed.
                {
                    statusCode: 500,
                    body: '500 Interal Server Error!',
                }
            )
            .then(() => {
                cy.wrap(
                    getAllPages('/fail')
                    .then(() => {
                        // The request should fail and be rejected
                        // so we should not get here.
                        // If we do, force the test to fail,
                        expect(true).to.equal(false)
                    })
                    .catch((err) => {
                        expect(err.response.status).to.equal(500)
                    })
                ).as('fail')
            })

            // Wait for everything to finish.
            cy.get('@fail')
        })
    })

    context('test maping functions', () => {
        it('User map functions get the proper name/id for the users', () => {
            let manager1ID = -1
            let adminID = -1
            let worker2ID = -1
            let guestID = -1
            let restws1ID = -1

            cy.wrap(getUserToIDMap()).as('nameMap')
            cy.get('@nameMap').should(function(nameToIdMap) {
                expect(nameToIdMap).to.not.be.null
                expect(nameToIdMap).to.be.a('Map')
                expect(nameToIdMap.size).to.equal(10)

                manager1ID = nameToIdMap.get('manager1')
                adminID = nameToIdMap.get('admin')
                worker2ID = nameToIdMap.get('worker2')
                guestID = nameToIdMap.get('guest')
                restws1ID = nameToIdMap.get('restws1')
            })
            .then(() => {
                cy.wrap(getIDToUserMap()).as('idMap')
                cy.get('@idMap').should(function(idToNameMap) {
                    expect(idToNameMap).to.not.be.null
                    expect(idToNameMap).to.be.a('Map')
                    expect(idToNameMap.size).to.equal(10)

                    expect(idToNameMap.get(manager1ID)).to.equal('manager1')
                    expect(idToNameMap.get(adminID)).to.equal('admin')
                    expect(idToNameMap.get(worker2ID)).to.equal('worker2')
                    expect(idToNameMap.get(guestID)).to.equal('guest')
                    expect(idToNameMap.get(restws1ID)).to.equal('restws1')
                })
            })
        })

        it('map failure', () => {
            // All of the get functions for maps use the same
            // helper function so only need to test the failure once.
            cy.intercept('GET', 'http://fd2_api/users/mapByName',
                {
                    statusCode: 500,
                    body: '500 Interal Server Error!',
                }
            )
            .then(() => {
                cy.wrap(
                    getUserToIDMap()
                    .then(() => {
                        expect(true).to.equal(false)
                    })
                    .catch((err) => {
                        expect(err.response.status).to.equal(500)
                    })
                ).as('fail')
            })

            cy.get('@fail')
        })

        it('Crop map functions get the proper name/id for the crops', () => {
            //first and last of the first page of the response
            let arugulaID = -1
            let strawberryID = -1
            //first and last of the second page of the response
            let sunflowerSeedsID = -1
            let zuchiniID = -1
            // test some compound names too
            let onionSpringID = -1
            let cornSweetID = -1

            cy.wrap(getCropToIDMap()).as('cropMap')
            cy.get('@cropMap').should((cropToIdMap) => {
                expect(cropToIdMap).to.not.be.null
                expect(cropToIdMap).to.be.a('Map')
                expect(cropToIdMap.size).to.equal(111)

                arugulaID = cropToIdMap.get('ARUGULA')
                strawberryID = cropToIdMap.get('STRAWBERRY')
                sunflowerSeedsID = cropToIdMap.get('SUNFLOWER SEEDS')
                zuchiniID = cropToIdMap.get('ZUCCHINI')
                onionSpringID = cropToIdMap.get('ONION-SPRING')
                cornSweetID = cropToIdMap.get('CORN-SWEET')
            })
            .then(() => {
                cy.wrap(getIDToCropMap()).as('idMap')
                cy.get('@idMap').should((idToCropMap) => {
                    expect(idToCropMap).to.not.be.null
                    expect(idToCropMap).to.be.a('Map')
                    expect(idToCropMap.size).to.equal(111)

                    expect(idToCropMap.get(arugulaID)).to.equal('ARUGULA')
                    expect(idToCropMap.get(strawberryID)).to.equal('STRAWBERRY')
                    expect(idToCropMap.get(sunflowerSeedsID)).to.equal('SUNFLOWER SEEDS')
                    expect(idToCropMap.get(zuchiniID)).to.equal('ZUCCHINI')
                    expect(idToCropMap.get(onionSpringID)).to.equal('ONION-SPRING')
                    expect(idToCropMap.get(cornSweetID)).to.equal('CORN-SWEET')
                })
            })
        })

        it('Area map functions get the proper name/id for the areas', () => {
            let aID = -1
            let zID = -1
            let chuauID = -1
            let chuau1ID = -1
            let chuau5ID = -1

            cy.wrap(getAreaToIDMap()).as('areaMap')
            cy.get('@areaMap').should(function(areaToIDMap){
                expect(areaToIDMap).to.not.be.null
                expect(areaToIDMap).to.be.a('Map')
                expect(areaToIDMap.size).to.equal(70)

                aID = areaToIDMap.get('A')
                zID = areaToIDMap.get('Z')
                chuauID = areaToIDMap.get('CHUAU')
                chuau1ID = areaToIDMap.get('CHUAU-1')
                chuau5ID = areaToIDMap.get('CHUAU-5')
            })
            .then(() => {
                cy.wrap(getIDToAreaMap()).as('idMap')
                cy.get('@idMap').should(function(idToAreaMap){
                    expect(idToAreaMap).to.not.be.null
                    expect(idToAreaMap).to.be.a('Map')
                    expect(idToAreaMap.size).to.equal(70)

                    expect(idToAreaMap.get(aID)).to.equal('A')
                    expect(idToAreaMap.get(zID)).to.equal('Z')
                    expect(idToAreaMap.get(chuauID)).to.equal('CHUAU')
                    expect(idToAreaMap.get(chuau1ID)).to.equal('CHUAU-1')
                    expect(idToAreaMap.get(chuau5ID)).to.equal('CHUAU-5')
                })
            })
        })

        it('Unit map functions get the proper name/id for the units',() => {
            let seedsID = -1
            let rowFeetID = -1
            let flatsID = -1
            let hoursID = -1
            let peopleID = -1

            cy.wrap(getUnitToIDMap()).as('unitMap')
            cy.get('@unitMap').should(function(unitToIDMap){
                expect(unitToIDMap).to.not.be.null
                expect(unitToIDMap).to.be.a('Map')
                expect(unitToIDMap.size).to.equal(33)

                seedsID = unitToIDMap.get('SEEDS')
                rowFeetID = unitToIDMap.get('ROW FEET')
                flatsID = unitToIDMap.get('FLATS')
                hoursID = unitToIDMap.get('HOURS')
                peopleID = unitToIDMap.get('PEOPLE')
            })
            .then(() => {
                cy.wrap(getIDToUnitMap()).as('idMap')
                cy.get('@idMap').should(function(idToUnitMap){
                    expect(idToUnitMap).to.not.be.null
                    expect(idToUnitMap).to.be.a('Map')
                    expect(idToUnitMap.size).to.equal(33)

                    expect(idToUnitMap.get(seedsID)).to.equal('SEEDS')
                    expect(idToUnitMap.get(rowFeetID)).to.equal('ROW FEET')
                    expect(idToUnitMap.get(flatsID)).to.equal('FLATS')
                    expect(idToUnitMap.get(hoursID)).to.equal('HOURS')
                    expect(idToUnitMap.get(peopleID)).to.equal('PEOPLE')
                })
            })
        })

        it('Log Type map functions get the proper name/id for the log types', () => {
            let directSeedingsID = -1
            let traySeedingsID = -1
            let waterID = -1
            let transplantingsID = -1
            let animalsID = -1

            cy.wrap(getLogTypeToIDMap()).as('logMap')
            cy.get('@logMap').should(function(logTypeToIDMap){
                expect(logTypeToIDMap).to.not.be.null
                expect(logTypeToIDMap).to.be.a('Map')
                expect(logTypeToIDMap.size).to.equal(9)

                directSeedingsID = logTypeToIDMap.get('Direct Seedings')
                traySeedingsID = logTypeToIDMap.get('Tray Seedings')
                waterID = logTypeToIDMap.get('Water')
                transplantingsID = logTypeToIDMap.get('Transplantings')
                animalsID = logTypeToIDMap.get('Animals')
            })
            .then(() => {
                cy.wrap(getIDToLogTypeMap()).as('idMap')
                cy.get('@idMap').should(function(idToLogTypeMap){
                    expect(idToLogTypeMap).to.not.be.null
                    expect(idToLogTypeMap).to.be.a('Map')
                    expect(idToLogTypeMap.size).to.equal(9)

                    expect(idToLogTypeMap.get(directSeedingsID)).to.equal('Direct Seedings')
                    expect(idToLogTypeMap.get(traySeedingsID)).to.equal('Tray Seedings')
                    expect(idToLogTypeMap.get(waterID)).to.equal('Water')
                    expect(idToLogTypeMap.get(transplantingsID)).to.equal('Transplantings')
                    expect(idToLogTypeMap.get(animalsID)).to.equal('Animals')
                })
            })
        })
    })

    context('getSessionToken API request function', () => {
        it('returns a token when it resolves', () => {
            getSessionToken().then(token => {
                expect(token).to.not.be.null
                expect(token.length).to.equal(43)
            })
        })

        it('fail to get token', () => {
            cy.intercept('GET', '/restws/session/token',
                // stub an error response so it looks like the request failed.
                {
                    statusCode: 500,
                    body: '500 Interal Server Error!',
                }
            )
            .then(() => {
                cy.wrap(
                    getSessionToken()
                    .then(() => {
                        // The request should fail and be rejected
                        // so we should not get here.
                        // If we do, force the test to fail,
                        expect(true).to.equal(false)
                    })
                    .catch((err) => {
                        expect(err.response.status).to.equal(500)
                    })
                ).as('fail')
            })

            // Wait for everything to finish.
            cy.get('@fail')
        })
    })

    context('getRecord API request function', () => {
        it('gets an existing log', () => {

            cy.wrap(getRecord('/log/100')).as('done')

            cy.get('@done').should(function(response) {
                expect(response.status).to.equal(200)
                expect(response.data.id).to.equal('100')
            })
        })

        it('gets an existing asset', () => {
            cy.wrap(getRecord('/farm_asset/1')).as('done')

            cy.get('@done').should(function(response) {
                expect(response.status).to.equal(200)
                expect(response.data.id).to.equal('1')
            })
        })

        it('attempt to get a non-existent record',() => {
            cy.wrap(
                getRecord('/log/9999999')
                .then(() => {
                    expect(true).to.equal(false)
                })
                .catch((err) => {
                    expect(err.response.status).to.equal(404)
                })
            ).as('fail')

            cy.get('@fail')
        })

        it('test that JSON in data property is parsed', () => {
            let cropToIDMap
            cy.wrap(getCropToIDMap()).as('cropMap')
            cy.get('@cropMap').then((theMap) => {
                cropToIDMap = theMap
            })

            // log #1 is a seeding so will have a data field.
            cy.wrap(getRecord('/log/1')).as('done')
            cy.get('@done').should((response) => {
                // Should not need to parse JSON here... so don't.
                expect(response.data.data.crop_tid).to.equal(cropToIDMap.get('ASPARAGUS'))
            })
        })

        it('test record without a data property', () => {
            // Assets do not have a data property.  This would fail
            // due to an error if the getRecord function did not handle
            // that condition properly.
            cy.wrap(getRecord('/farm_asset/1')).as('done')
            cy.get('@done').should((response) => {
                expect(response.data.data).to.be.null
            })
        })

        it('fail to get a log', () => {
            cy.intercept('GET', '/log/12345',
                // stub an error response so it looks like the request failed.
                {
                    statusCode: 500,
                    body: '500 Interal Server Error!',
                }
            )
            .then(() => {
                cy.wrap(
                    getRecord('/log/12345')
                    .then(() => {
                        // The request should fail and be rejected
                        // so we should not get here.
                        // If we do, force the test to fail,
                        expect(true).to.equal(false)
                    })
                    .catch((err) => {
                        expect(err.response.status).to.equal(500)
                    })
                ).as('fail')
            })

            // Wait for everything to finish.
            cy.get('@fail')
        })
    })

    context('deleteRecord API request function', () => {
        it('deletes a log', () => {
            let logID = -1
            let token = null

            // Creates a new log entry & ensures it was successful.
            // Deletes the log entry using the deleteRecord function.
            // Requests the log to ensure that it has been deleted.

            cy.wrap(getSessionToken())
            .then(sessionToken => {
                token = sessionToken

                let req = {
                    url: '/log',
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN' : token,
                    },
                    body: {
                        "name": "Delete Test",
                        "type": "farm_observation",
                        "timestamp": "123",
                    }
                }

                cy.request(req).as('create')
            })

            cy.get('@create').should(function(response) {
                expect(response.status).to.equal(201)
                logID = response.body.id
            })
            .then(() => {
                cy.wrap(deleteRecord('/log/' + logID, token)).as('delete')
            })

            cy.get('@delete').should((response) => {
                expect(response.status).to.equal(200)
            })
            .then(() => {
                cy.wrap(
                    getRecord('/log/' + logID)
                    .then(() => {
                        expect(true).to.equal(false)
                    })
                    .catch((err) => {
                        expect(err.response.status).to.equal(404) // 404 - not found
                    })
                ).as('check')
            })

            cy.get('@check')
        })

        it('failed delete', () => {
            cy.intercept('DELETE', '/log/12345',
                // stub an error response so it looks like the request failed.
                {
                    statusCode: 500,
                    body: '500 Interal Server Error!',
                }
            )
            .then(() => {
                cy.wrap(
                    deleteRecord('/log/12345', null)
                    .then(() => {
                        // The request should fail and be rejected
                        // so we should not get here.
                        // If we do, force the test to fail,
                        expect(true).to.equal(false)
                    })
                    .catch((err) => {
                        expect(err.response.status).to.equal(500)
                    })
                ).as('fail')
            })

            // Wait for everything to finish.
            cy.get('@fail')
        })
    })

    context('create API request function', () => {
        it('creates a new log', () => {

            let logID = -1
            let token = null

            // Creates a new log using the createRecord function
            // Checks that it exists
            // Deletes it using the deleteRecord function (tested above)

            cy.wrap(getSessionToken())
            .then((sessionToken) => {
                token = sessionToken

                let newLog = {
                    "name": "Create Test",
                    "type": "farm_observation",
                    "timestamp": "123",
                }

                cy.wrap(createRecord('/log', newLog, token)).as('create')
            })

            cy.get('@create').should((response) => {
                logID = response.data.id
                expect(response.status).to.equal(201)
            })
            .then(() => {
                cy.wrap(getRecord('/log/' + logID)).as('exists')
            })

            cy.get('@exists').should((response) => {
                expect(response.status).to.equal(200)
                expect(response.data.name).to.equal('Create Test')
                expect(response.data.data).to.be.null
            })
            .then(() => {
                cy.wrap(deleteRecord('/log/' + logID, token)).as('delete')
            })

            cy.get('@delete').should(function(response) {
                expect(response.status).to.equal(200)
            })
        })

        it('test create log with a data property', () => {
            let logID = -1
            let token = null

            cy.wrap(getSessionToken())
            .then((sessionToken) => {
                token = sessionToken

                let newLog = {
                    "name": "Create Test",
                    "type": "farm_observation",
                    "timestamp": "123",
                    "data" : { crop_tid: 123 }
                }

                cy.wrap(createRecord('/log', newLog, token)).as('create')
                cy.get('@create').should((response) => {
                    logID = response.data.id
                    expect(response.status).to.equal(201)
                })
                .then(() => {
                    cy.wrap(getRecord('/log/' + logID)).as('exists')
                })

                cy.get('@exists').should((response) => {
                    expect(response.status).to.equal(200)
                    expect(response.data.name).to.equal('Create Test')
                    expect(response.data.data).to.not.be.null
                    expect(response.data.data.crop_tid).to.equal(123)
                })
                .then(() => {
                    cy.wrap(deleteRecord('/log/' + logID, token)).as('delete')
                })

                cy.get('@delete').should(function(response) {
                    expect(response.status).to.equal(200)
                })
            })
        })

        it('failed create', () => {
            cy.intercept('POST', '/log',
                // stub an error response so it looks like the request failed.
                {
                    statusCode: 500,
                    body: '500 Interal Server Error!',
                }
            )
            .then(() => {
                cy.wrap(
                    createRecord('/log', { "data": "null" }, null)
                    .then(() => {
                        // The request should fail and be rejected
                        // so we should not get here.
                        // If we do, force the test to fail,
                        expect(true).to.equal(false)
                    })
                    .catch((err) => {
                        expect(err.response.status).to.equal(500)
                    })
                ).as('fail')
            })

            // Wait for everything to finish.
            cy.get('@fail')
        })
    })

    context('update function testing', () => {
        it('change the name of an observation log', () => {
            let logID = -1
            let token = null

            // Creates a new log using the createRecord function (tested above)
            // Updates the log using the updateRecord function.
            // Requests the log using the getLog function (tested above)
            // Deletes the log using the deleteRecord function (tested above)

            cy.wrap(getSessionToken())
            .then((sessionToken) => {
                token = sessionToken

                let newLog = {
                    "name": "Update Test",
                    "type": "farm_observation",
                    "timestamp": "123",
                }

                cy.wrap(createRecord('/log', newLog, token)).as('create')
            })

            cy.get('@create').should((response) => {
                logID = response.data.id
                expect(response.status).to.equal(201)
            })
            .then(() => {
                let update = {
                    "name": "Update Test Updated"
                }

                cy.wrap(updateRecord('/log/' + logID, update, token)).as('update')
            })

            cy.get('@update').should((response) => {
                expect(response.status).to.equal(200)
            })
            .then(() => {
                cy.wrap(getRecord('/log/' + logID)).as('check')
            })

            cy.get('@check').should((response) => {
                expect(response.status).to.equal(200)
                expect(response.data.name).to.equal('Update Test Updated')
                expect(response.data.data).to.be.null
            })
            .then(() => {
                cy.wrap(deleteRecord('/log/' + logID, token)).as('delete')
            })

            cy.get('@delete').should(function(response) {
                expect(response.status).to.equal(200)
            })
        })

        it('updte a record that has a data property', () => {
            let logID = -1
            let token = null

            cy.wrap(getSessionToken())
            .then((sessionToken) => {
                token = sessionToken

                let newLog = {
                    "name": "Update Test",
                    "type": "farm_observation",
                    "timestamp": "123",
                    "data" : { crop_tid: 123 }
                }

                cy.wrap(createRecord('/log', newLog, token)).as('create')
            })

            cy.get('@create').should((response) => {
                logID = response.data.id
                expect(response.status).to.equal(201)
            })
            .then(() => {
                let update = {
                    "name": "Update Test Updated",
                    "data": { crop_tid: 234 }
                }

                cy.wrap(updateRecord('/log/' + logID, update, token)).as('update')
            })

            cy.get('@update').should((response) => {
                expect(response.status).to.equal(200)
            })
            .then(() => {
                cy.wrap(getRecord('/log/' + logID)).as('check')
            })

            cy.get('@check').should((response) => {
                expect(response.status).to.equal(200)
                expect(response.data.name).to.equal('Update Test Updated')
                expect(response.data.data).to.not.be.null
                expect(response.data.data.crop_tid).to.equal(234)
            })
            .then(() => {
                cy.wrap(deleteRecord('/log/' + logID, token)).as('delete')
            })

            cy.get('@delete').should(function(response) {
                expect(response.status).to.equal(200)
            })
        })

        it('failed update', () => {
            cy.intercept('PUT', '/log',
                // stub an error response so it looks like the request failed.
                {
                    statusCode: 500,
                    body: '500 Interal Server Error!',
                }
            )
            .then(() => {
                cy.wrap(
                    updateRecord('/log', { "data": "null" }, null)
                    .then(() => {
                        // The request should fail and be rejected
                        // so we should not get here.
                        // If we do, force the test to fail,
                        expect(true).to.equal(false)
                    })
                    .catch((err) => {
                        expect(err.response.status).to.equal(500)
                    })
                ).as('fail')
            })

            // Wait for everything to finish.
            cy.get('@fail')
        })
    })

    context('test quantity location function', () => {
            let quantity = [{
                "measure": "length",
                "value": 5,
                "unit": {
                    "id": "1987",
                    "resource": "taxonomy_term"
                },
                "label": "Amount planted"
            },
            {
                "measure": "ratio",
                "value": 19,
                "unit": {
                    "id": "98",
                    "resource": "taxonomy_term"
                },
                "label": "Rows/Bed"
            },
            {
                "measure": "time",
                "value": 178,
                "unit": {
                    "id": "80",
                    "resource": "taxonomy_term"
                },
                "label": "Labor"
            },
            {
                "measure": "count",
                "value": 1,
                "unit": {
                    "id": "90",
                    "resource": "taxonomy_term"
                },
                "label": "Workers"
            }]

            it('test if returns 2 for Labor', () => {
                expect(quantityLocation(quantity, 'Labor')).to.equal(2)
            })
            it('test if returns 0 for "Amount planted"', () =>{
                expect(quantityLocation(quantity, 'Amount planted')).to.equal(0)
            })
            it('returns -1 when no label equal the label input', () => {
                expect(quantityLocation(quantity, 'Yeehaw')).to.equal(-1)
            })
        })
    
    context('test configuration functions', () => {
        
        it('gets an existing configuration log', () => {
            cy.wrap(getConfiguration()).as('done')

            cy.get('@done').should((response) => {
                expect(response.status).to.equal(200)
                expect(response.data.id).to.equal('1')
                expect(response.data.labor).to.equal('Required')
            })
        })

        it('sets labor to optional, then back to Required', () => {
            let token = null
            cy.wrap(getSessionToken())
            // First request for the session token.
            .then((sessionToken) => {
                token = sessionToken
            })
            // Then update the log using the token
            .then(() => {
                let updateData =
                    {
                        "id" : "1",
                        "labor":"Optional"
                    }
                cy.wrap(setConfiguration(updateData , token)).as('update')
            })
            cy.get('@update').should((response) => {
            expect(response.status).to.equal(200)
            })
            // If the update was successful, change the labor data to optional.
            .then(() => {
                cy.wrap(getConfiguration()).as('changed')
            })
            cy.get('@changed').should((response) => {
                expect(response.status).to.equal(200)
                expect(response.data.id).to.equal('1')
                expect(response.data.labor).to.equal('Optional')
            })
            // If the change was successful, change it back to required
            .then(() => {
                let resetData =
                    {
                        "id" : "1",
                        "labor":"Required"
                    }

                cy.wrap(setConfiguration(resetData, token)).as('default')
            })
            cy.get('@default').should((response) => {
                expect(response.status).to.equal(200)
            })
            .then(() => {
                cy.wrap(getConfiguration()).as('reset')
            })
            cy.get('@reset').should((response) => {
                expect(response.status).to.equal(200)
                expect(response.data.id).to.equal('1')
                expect(response.data.labor).to.equal('Required')
            })
        })

    })
})
