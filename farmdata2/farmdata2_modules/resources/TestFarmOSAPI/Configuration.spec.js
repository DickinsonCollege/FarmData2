var FarmOSAPI = require("../FarmOSAPI.js")

var getAllPages = FarmOSAPI.getAllPages
var getSessionToken = FarmOSAPI.getSessionToken
var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var quantityLocation = FarmOSAPI.quantityLocation

describe('API Request Functions', () => {
    beforeEach(() => {
        // Login as restws1, which is a user that can make api requests.
        cy.login('restws1', 'farmdata2')
    })

    context('getAllPages API request function', () => {
        it('Test on a request with a one page response.', () => {

            let requests = 0
            let testArray = []

            cy.intercept('GET', /log\?type=farm_seeding/, (req) => {
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
            let firstCalls = 0
            let secondCalls = 0
            let lastCalls = 0
            let testArray = []

            cy.intercept("GET", "/log?type=farm_seeding&page=5", (req) => {
                firstCalls++
            })
            cy.intercept("GET", "/log?type=farm_seeding&page=6", (req) => {
                secondCalls++
            })
            cy.intercept("GET", "/log?type=farm_seeding&page=9", (req) => {
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
