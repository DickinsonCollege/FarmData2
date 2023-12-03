var FarmOSAPI = require("../FarmOSAPI.js")

var getAllPages = FarmOSAPI.getAllPages
var getSessionToken = FarmOSAPI.getSessionToken
var updateRecord = FarmOSAPI.updateRecord
var createRecord = FarmOSAPI.createRecord
var deleteRecord = FarmOSAPI.deleteRecord
var getRecord = FarmOSAPI.getRecord

var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var quantityLocation = FarmOSAPI.quantityLocation

describe('API Request Functions', () => {
    beforeEach(() => {
        // Login as restws1, which is a user that can make api requests.
        cy.login('restws1', 'farmdata2')
    })

    context('getRecord API request function', () => {
        it('gets an existing log', () => {

            cy.wrap(getRecord('/log/100')).as('done')

            cy.get('@done').should(function (response) {
                expect(response.status).to.equal(200)
                expect(response.data.id).to.equal('100')
            })
        })

        it('gets an existing asset', () => {
            cy.wrap(getRecord('/farm_asset/1')).as('done')

            cy.get('@done').should(function (response) {
                expect(response.status).to.equal(200)
                expect(response.data.id).to.equal('1')
            })
        })

        it('attempt to get a non-existent record', () => {
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
                            'X-CSRF-TOKEN': token,
                        },
                        body: {
                            "name": "Delete Test",
                            "type": "farm_observation",
                            "timestamp": "123",
                        }
                    }

                    cy.request(req).as('create')
                })

            cy.get('@create').should(function (response) {
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

            cy.get('@delete').should(function (response) {
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
                        "data": { crop_tid: 123 }
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

                    cy.get('@delete').should(function (response) {
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

            cy.get('@delete').should(function (response) {
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
                        "data": { crop_tid: 123 }
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

            cy.get('@delete').should(function (response) {
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
        it('test if returns 0 for "Amount planted"', () => {
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
                        "id": "1",
                        "labor": "Optional"
                    }
                    cy.wrap(setConfiguration(updateData, token)).as('update')
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
                        "id": "1",
                        "labor": "Required"
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
