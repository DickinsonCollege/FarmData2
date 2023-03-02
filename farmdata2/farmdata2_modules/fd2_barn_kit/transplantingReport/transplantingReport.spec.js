const dayjs = require('dayjs')
var FarmOSAPI = require('../../resources/FarmOSAPI.js')
var getSessionToken = FarmOSAPI.getSessionToken
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var getIDToCropMap = FarmOSAPI.getIDToCropMap
var getAreaToIDMap = FarmOSAPI.getAreaToIDMap
var getUserToIDMap = FarmOSAPI.getUserToIDMap
var getUnitToIDMap = FarmOSAPI.getUnitToIDMap
var getRecord = FarmOSAPI.getRecord
var deleteRecord = FarmOSAPI.deleteRecord
var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration

describe('Testing for the transplanting report page', () => {
    let cropToIDMap = null
    let IDToCropMap = null
    let areaToIDMap = null
    let userToIDMap = null
    let unitToIDMap = null
    let defaultConfig = null
    let testConfig = { id: "1", labor: 'Required' }

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-barn-kit/transplantingReport')
    
        // Wait here for the maps to load in the page.   
        cy.waitForPage()
    })

    context('can set dates and then render the report', () => {

        it('allows user input of the start and end dates', () => {
            cy.get('[data-cy=date-range-selection]')
                .should('exist')

            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2019-01-01')

            cy.get('[data-cy=end-date-select]')
                .should('exist')
                .type('2019-03-01')
                
            cy.get('[data-cy=date-select]')
                .each(($el, index, $all) => {
                    if (index == 0) {
                        expect($el).to.have.value('2019-01-01')
                    }
                    else if (index == 1){
                        expect($el).to.have.value('2019-03-01')
                    }
                })
        })

        it('generate report button renders the rest of the page', () => {
            cy.get('[data-cy=generate-rpt-btn]')
                .click()

            cy.get('[data-cy=filters-panel]')
                .should('exist')

            cy.get('[data-cy=report-table]')
                .should('exist')

            cy.get('[data-cy=transplanting-summary]')
                .should('exist')
        })

        it('generate report experiences API error: outside of 2xx error code', () => {
            cy.get('[data-cy=date-range-selection]')
                .should('exist')
            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .should('exist')
                .type('2019-03-01')

            cy.intercept('GET', '/log.json?type=farm_transplanting&timestamp[ge]=1546300800&timestamp[le]=1551398400', { statusCode: 500 })
            .as('getAPIFailure')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
            cy.wait('@getAPIFailure')
            .then(() => {
                cy.get('[data-cy=alert-err-handler]')
                cy.window().its('scrollY').should('equal', 0)
                cy.get('[data-cy=alert-err-handler]')
                .should('be.visible')
                .click()
                .should('not.visible')
            }) 
            cy.get('[data-cy=filters-panel]')
                .should('not.exist')

            cy.get('[data-cy=report-table]')
                .should('not.exist')

                cy.get('[data-cy=transplanting-summary]')
                .should('not.exist')
        }) 

        it('generate report experiences API error: network error', () => {
            cy.get('[data-cy=date-range-selection]')
                .should('exist')
            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .should('exist')
                .type('2019-03-01')

            cy.intercept('GET', '/log.json?type=farm_transplanting&timestamp[ge]=1546300800&timestamp[le]=1551398400', { forceNetworkError: true })
            .as('getAPIFailure')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
            cy.wait('@getAPIFailure')
            .then(() => {
                cy.get('[data-cy=alert-err-handler]')
                cy.window().its('scrollY').should('equal', 0)
                cy.get('[data-cy=alert-err-handler]')
                .should('be.visible')
                .click()
                .should('not.visible')
            }) 
            cy.get('[data-cy=filters-panel]')
                .should('not.exist')

            cy.get('[data-cy=report-table]')
                .should('not.exist')

            cy.get('[data-cy=transplanting-summary]')
                .should('not.exist')
        }) 
    })

    context('assures filters are actually populated', () => {

        it('test if crops are correctly loaded to the filter dropdown', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-05-01')
            cy.get('[data-cy=generate-rpt-btn]').click()

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'All')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()  
                .next()
                .should('have.value', 'BOKCHOY')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .last()
                .should('have.value', 'SCALLION')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', '19')
        })

        it('test if areas are correctly loaded to the filter dropdown', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-05-01')
            cy.get('[data-cy=generate-rpt-btn]').click()

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'All')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()  
                .next()
                .should('have.value', 'CHUAU-2')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .last()
                .should('have.value', 'T')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', '8')
        })
    })

    context('can see spinner at appropriate times', () => {

        it('show spinner after input', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-08-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=loader]').should('be.visible')
        })

        it('spinner dissappears after whole response returns 1 page', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-05-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=report-table]').find('tr').its('length').then(length =>{
                expect(length).to.equal(30)
                cy.get('[data-cy=loader]').should('not.exist')
            }) 
        })

        it('spinner reappears after changing values and clicking again', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-08-03')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=loader]').should('be.visible')
        })
    })

    context('clicking on date ranges hides report', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-05-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('clicking on start date range hides report', () => {
            cy.get('[data-cy=report-table]').should('exist')
            cy.get('[data-cy=start-date-select]').click()

            cy.get('[data-cy=generate-rpt-btn]')
                .should('exist')
            cy.get('[data-cy=filters-panel]')
                .should('not.exist')
            cy.get('[data-cy=report-table]')
                .should('not.exist')
            cy.get('[data-cy=direct-summary]')
                .should('not.exist')
            cy.get('[data-cy=tray-summary]')
                .should('not.exist')
        })

        it('clicking on end date range hides report', () => {
            cy.get('[data-cy=report-table]').should('exist')
            cy.get('[data-cy=end-date-select]').click()

            cy.get('[data-cy=generate-rpt-btn]')
                .should('exist')
            cy.get('[data-cy=filters-panel]')
                .should('not.exist')
            cy.get('[data-cy=report-table]')
                .should('not.exist')
            cy.get('[data-cy=direct-summary]')
                .should('not.exist')
            cy.get('[data-cy=tray-summary]')
                .should('not.exist')
        })
    })

    context('can see No Logs message at appropriate times', () => {

        it('the No Logs message does not appear with a table with logs', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-05-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=no-logs-message]').should('not.exist')
        })

        it('the No Logs message appears with a table with no logs', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2021-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2021-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=no-logs-message]').should('be.visible')
        })
    })

    context('can see the summary table at appropriate times and displays appropriate message', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-05-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('does not immediately display summary tables', () => {
            cy.get('[data-cy=transplanting-summary]').should('not.exist')
        })

        it('shows summary tables after table is fully loaded', () => {
            cy.get('[data-cy=report-table]')
            cy.get('[data-cy=transplanting-summary]').should('be.visible')
        }) 
    })

    context('displays the right information in the table', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-05-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()

            cy.get('[data-cy=report-table]').find('tr').its('length')
                .then(length =>{
                    expect(length).to.equal(30)
                })
        })

        it('requests and displays logs that fall between the specified dates', () => {
            let currentTimestamp = null
            const startTimestamp = dayjs('2019-01-01').unix()
            const endTimestamp = dayjs('2019-05-01').unix()

            for(let r = 0; r < 28; r++){
                cy.get('[data-cy=r' + r + 'c0')
                    .invoke('text')
                    .then(dateText => {
                        currentTimestamp = dayjs(dateText).unix()
                        expect(currentTimestamp).is.within(startTimestamp, endTimestamp)
                    })
            }
        })

        it('filters by crop', () => {
            let crop = null
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('BROCCOLI')
                .should('have.value', 'BROCCOLI')


            for(let r = 0; r < 2; r++){
                cy.get('[data-cy=r' + r + 'c1')
                    .invoke('text')
                    .then(actualCrop => {
                        crop = actualCrop
                        expect(crop, 'BROCCOLI')
                    })
            }

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')
        })

        it('filters by field', () => {
            let area = null
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .select('CHUAU-4')
                .should('have.value', 'CHUAU-4')

            for(let r = 0; r < 4; r++){
                cy.get('[data-cy=r' + r + 'c2')
                    .invoke('text')
                    .then(actualArea => {
                        area = actualArea
                        expect(area, 'CHUAU-4')
                    })
            }
            
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')
            })
        })

    context('has the correct totals in the transplanting summary tables', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-05-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('verify all values in the transplanting seeding summary', () => {
            cy.get('[data-cy=transplant-total-rowft]')
            .should('have.text', '9674')
    
            cy.get('[data-cy=transplant-total-bedft]')
            .should('have.text', '3778')
    
            cy.get('[data-cy=transplant-total-numTrays]')
            .should('have.text', '92')
    
            cy.get('[data-cy=transplant-total-hours]')
            .should('have.text', '48.92')

            cy.get('[data-cy=transplant-total-rowft-hour]')
            .should('have.text', '197.75')

            cy.get('[data-cy=transplant-total-bedfr-hour]')
            .should('have.text', '77.23')
        })
    })

    context('has the correct totals in the seeding summary tables with hidden labor config', () => {
        let logID = 0
        let logID2 = 0
        let logIDTransplant = 0
        beforeEach(() =>{
            cy.login('manager1', 'farmdata2')
            .then(() => {
                cy.wrap(getConfiguration()).as('def')
                cy.wrap(getSessionToken()).as('token')
            }) 
            cy.get('@token').should(function(token) {
                sessionToken = token
            })
            cy.get('@def').should(function(map) {
                configMap = map.data
                defaultConfig = configMap
            })
        })
        beforeEach(() =>{
            cy.wrap(getSessionToken())
            .then(sessionToken => {
                token = sessionToken
                req = {
                    url: '/log',
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN' : token,
                    },
                    body: {
                        "name": "2019-03-27 TESTING CHUAU-2",
                        "type": "farm_transplanting",
                        "timestamp": dayjs('2001-10-16').unix(),
                        "done": "1", 
                        "notes": {
                            "value": "<p>Testing Transplanting Report</p>\n",
                            "format": "farm_format"
                        },
                        "asset": [{ 
                            "id": "235",
                            "resource": "farm_asset"
                        }],
                        "log_category": [{
                            "id": "242",
                            "resource": "taxonomy_term"
                        }],
                        "movement": {
                            "area": [{
                                "id": "182",
                                "resource": "taxonomy_term"
                            }]
                        },
                        "quantity": [
                            {
                                "measure": "length", 
                                "value": "3",  
                                "unit": {
                                    "id": "20", 
                                    "resource": "taxonomy_term"
                                },
                                "label": "Amount planted"
                            },
                            {
                                "measure": "ratio", 
                                "value": "3", 
                                "unit": {
                                    "id": "38",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Rows/Bed"
                            },
                            {
                                "measure": "count", 
                                "value": "2", 
                                "unit": {
                                    "id": "12",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Flats"
                            },
                            {
                                "measure": "time", 
                                "value": "0",  
                                "unit": {
                                    "id": "29",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Labor"
                            },
                            {
                                "measure": "count", 
                                "value": "0",
                                "unit": {
                                    "id": "15",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Workers"
                            },
                        ],
                        "created": dayjs().unix(),
                        "uid": {
                            "id": "11",
                            "resource": "user"
                        },
                        "log_owner": [{
                            "id": "11",
                            "resource": "user"
                        }],
                        "data": "{\"crop_tid\": \"166\"}"
                    }
                }
                
                reqTransplant = {
                    url: '/log',
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN' : token,
                    },
                    body: {
                        "name": "2019-03-27 TESTING CHUAU-2",
                        "type": "farm_transplanting",
                        "timestamp": dayjs('2001-10-16').unix(),
                        "done": "1", 
                        "notes": {
                            "value": "<p>Testing Transplanting Report</p>\n",
                            "format": "farm_format"
                        },
                        "asset": [{ 
                            "id": "235",
                            "resource": "farm_asset"
                        }],
                        "log_category": [{
                            "id": "242",
                            "resource": "taxonomy_term"
                        }],
                        "movement": {
                            "area": [{
                                "id": "182",
                                "resource": "taxonomy_term"
                            }]
                        },
                        "quantity": [
                            {
                                "measure": "length", 
                                "value": "3",  
                                "unit": {
                                    "id": "20", 
                                    "resource": "taxonomy_term"
                                },
                                "label": "Amount planted"
                            },
                            {
                                "measure": "ratio", 
                                "value": "3", 
                                "unit": {
                                    "id": "38",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Rows/Bed"
                            },
                            {
                                "measure": "count", 
                                "value": "2", 
                                "unit": {
                                    "id": "12",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Flats"
                            },
                            {
                                "measure": "time", 
                                "value": "0",  
                                "unit": {
                                    "id": "29",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Labor"
                            },
                            {
                                "measure": "count", 
                                "value": "0",
                                "unit": {
                                    "id": "15",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Workers"
                            },
                        ],
                        "created": dayjs().unix(),
                        "uid": {
                            "id": "11",
                            "resource": "user"
                        },
                        "log_owner": [{
                            "id": "11",
                            "resource": "user"
                        }],
                        "data": "{\"crop_tid\": \"166\"}"
                    }
                }
                cy.request(req).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID = response.body.id
                })
                cy.request(reqTransplant).as('create2')
                cy.get('@create2').should(function(response) {
                    expect(response.status).to.equal(201)
                    logIDTransplant = response.body.id
                })
            })
            requiredConfig = {id: 1, labor: 'Required'}
            cy.wrap(setConfiguration(requiredConfig, sessionToken)).as('updateConfig')
            cy.get('@updateConfig')
            .then(() => {
                cy.reload()
            })

        })


        afterEach(() => {
            cy.wrap(setConfiguration(defaultConfig, sessionToken)).as('resetConfig')
            cy.get('@resetConfig').should((response) => {
                expect(response.status).to.equal(200)  // 201
            }) 
            cy.wrap(deleteRecord("/log/" + logID , sessionToken)).as('transplantingDelete1')
            cy.get('@transplantingDelete1').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })

            cy.wrap(deleteRecord("/log/" + logIDTransplant , sessionToken)).as('transplantingDelete2')
            cy.get('@transplantingDelete2').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })

        })

        it('test summary table values when all logs have no labor data', () => {
            req2 = {
                url: '/log',
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN' : token,
                },
                body: {
                    "name": "2019-03-27 TESTING CHUAU-2",
                    "type": "farm_transplanting",
                    "timestamp": dayjs('2001-10-16').unix(),
                    "done": "1", 
                    "notes": {
                        "value": "<p>Testing Transplanting Report</p>\n",
                        "format": "farm_format"
                    },
                    "asset": [{ 
                        "id": "235",
                        "resource": "farm_asset"
                    }],
                    "log_category": [{
                        "id": "242",
                        "resource": "taxonomy_term"
                    }],
                    "movement": {
                        "area": [{
                            "id": "182",
                            "resource": "taxonomy_term"
                        }]
                    },
                    "quantity": [
                        {
                            "measure": "length", 
                            "value": "3",  
                            "unit": {
                                "id": "20", 
                                "resource": "taxonomy_term"
                            },
                            "label": "Amount planted"
                        },
                        {
                            "measure": "ratio", 
                            "value": "3", 
                            "unit": {
                                "id": "38",
                                "resource": "taxonomy_term"
                            },
                            "label": "Rows/Bed"
                        },
                        {
                            "measure": "count", 
                            "value": "2", 
                            "unit": {
                                "id": "12",
                                "resource": "taxonomy_term"
                            },
                            "label": "Flats"
                        },
                        {
                            "measure": "time", 
                            "value": "0",  
                            "unit": {
                                "id": "29",
                                "resource": "taxonomy_term"
                            },
                            "label": "Labor"
                        },
                        {
                            "measure": "count", 
                            "value": "0",
                            "unit": {
                                "id": "15",
                                "resource": "taxonomy_term"
                            },
                            "label": "Workers"
                        },
                    ],
                    "created": dayjs().unix(),
                    "uid": {
                        "id": "11",
                        "resource": "user"
                    },
                    "log_owner": [{
                        "id": "11",
                        "resource": "user"
                    }],
                    "data": "{\"crop_tid\": \"166\"}"
                }
            }
            cy.request(req2).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID2 = response.body.id
                })

            cy.get('[data-cy=start-date-select]')
            .type('2001-10-16')
            cy.get('[data-cy=end-date-select]')
            .type('2001-10-17')
            cy.get('[data-cy=generate-rpt-btn]')
            .click()

            cy.get('[data-cy=transplant-total-rowft]')
                .should('have.text', '9')
            cy.get('[data-cy=transplant-total-bedft]')
            .should('have.text', '3')
            cy.get('[data-cy=transplant-total-numTrays]')
            .should('have.text', '6')
            cy.get('[data-cy=transplant-total-hours]')
            .should('have.text', '0')
            cy.get('[data-cy=transplant-total-rowft-hour]')
            .should('have.text', 'N/A')
            cy.get('[data-cy=transplant-total-bedfr-hour]')
            .should('have.text', 'N/A')
            .then(() => {
                cy.wrap(deleteRecord("/log/" + logID2 , sessionToken)).as('seedingDelete2')
            })
            cy.get('@seedingDelete2').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })
        })

        it('test summary table values when there are mixed labor data', () => {
            req2 = {
                url: '/log',
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN' : token,
                },
                body: {
                    "name": "2019-03-27 TESTING CHUAU-2",
                    "type": "farm_transplanting",
                    "timestamp": dayjs('2001-10-16').unix(),
                    "done": "1", 
                    "notes": {
                        "value": "<p>Testing Transplanting Report</p>\n",
                        "format": "farm_format"
                    },
                    "asset": [{ 
                        "id": "235",
                        "resource": "farm_asset"
                    }],
                    "log_category": [{
                        "id": "242",
                        "resource": "taxonomy_term"
                    }],
                    "movement": {
                        "area": [{
                            "id": "182",
                            "resource": "taxonomy_term"
                        }]
                    },
                    "quantity": [
                        {
                            "measure": "length", 
                            "value": "3",  
                            "unit": {
                                "id": "20", 
                                "resource": "taxonomy_term"
                            },
                            "label": "Amount planted"
                        },
                        {
                            "measure": "ratio", 
                            "value": "3", 
                            "unit": {
                                "id": "38",
                                "resource": "taxonomy_term"
                            },
                            "label": "Rows/Bed"
                        },
                        {
                            "measure": "count", 
                            "value": "2", 
                            "unit": {
                                "id": "12",
                                "resource": "taxonomy_term"
                            },
                            "label": "Flats"
                        },
                        {
                            "measure": "time", 
                            "value": "3",  
                            "unit": {
                                "id": "29",
                                "resource": "taxonomy_term"
                            },
                            "label": "Labor"
                        },
                        {
                            "measure": "count", 
                            "value": "2",
                            "unit": {
                                "id": "15",
                                "resource": "taxonomy_term"
                            },
                            "label": "Workers"
                        },
                    ],
                    "created": dayjs().unix(),
                    "uid": {
                        "id": "11",
                        "resource": "user"
                    },
                    "log_owner": [{
                        "id": "11",
                        "resource": "user"
                    }],
                    "data": "{\"crop_tid\": \"166\"}"
                }
            }

            cy.request(req2).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID2 = response.body.id
                })

            cy.get('[data-cy=start-date-select]')
            .type('2001-10-16')
            cy.get('[data-cy=end-date-select]')
            .type('2001-10-17')
            cy.get('[data-cy=generate-rpt-btn]')
            .click()
        
            cy.get('[data-cy=transplant-total-rowft]')
                .should('have.text', '9')

            cy.get('[data-cy=transplant-total-bedft]')
            .should('have.text', '3')

            cy.get('[data-cy=transplant-total-numTrays]')
            .should('have.text', '6')

            cy.get('[data-cy=transplant-total-hours]')
            .should('have.text', '6')

            cy.get('[data-cy=transplant-total-rowft-hour]')
            .should('have.text', '1.5')

            cy.get('[data-cy=transplant-total-bedfr-hour]')
            .should('have.text', '0.5')
            .then(() => {
                cy.wrap(deleteRecord("/log/" + logID2 , sessionToken)).as('seedingDelete2')
            })
            cy.get('@seedingDelete2').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })
        })
    })

    context('displays only relevant columns under certain conditions', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-05-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('displays only relevant columns', () => {
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Bed Feet')
            cy.get('[data-cy=h4]')
                .should('have.text', 'Row Feet')
            cy.get('[data-cy=h5]')
                .should('have.text', 'Rows/Bed')
            cy.get('[data-cy=h6]')
                .should('have.text', 'Trays')
            cy.get('[data-cy=h7]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h8]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h9]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h10]')
                .should('have.text', 'User')
            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')
            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')
        })

        it('displays only relevant columns when in edit mode', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Bed Feet')
            cy.get('[data-cy=h4]')
                .should('have.text', 'Row Feet')
            cy.get('[data-cy=h5]')
                .should('have.text', 'Rows/Bed')
            cy.get('[data-cy=h6]')
                .should('have.text', 'Trays')
            cy.get('[data-cy=h7]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h8]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h9]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h10]')
                .should('have.text', 'User')
            cy.get('[data-cy=edit-header]')
                .should('not.exist')
            cy.get('[data-cy=delete-header]')
                .should('not.exist')
            cy.get('[data-cy=save-header]')
                .should('have.text', 'Save')
            cy.get('[data-cy=cancel-header]')
                .should('have.text', 'Cancel')

            //Force the action to occur because in the viewport isn't big enough for the 
            //button to be clickable
            cy.get('[data-cy=cancel-button-r0]')
                .click({force:true})
        })
    })

    context('date picker and filter behavior', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-04-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('updates area options when a new crop has been selected', () => {
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'CHUAU-2')
                    .next()
                        .should('have.value', 'CHUAU-4')
                    .next()
                        .should('have.value', 'JASMINE-1')

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('SCALLION')
                .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'CHUAU-2')

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')
        })

        it('updates crop options when a new area has been selected', () => {
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'CHARD')
                    .next()
                        .should('have.value', 'COLLARDS')
                    .next()
                        .should('have.value', 'KALE')
                    .next()
                        .should('have.value', 'LETTUCE-GREEN')
                    .next()
                        .should('have.value', 'LETTUCE-RED')
                    .next()
                        .should('have.value', 'LETTUCE-ROMAINE')
                    .next()
                        .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .select('CHUAU-4')
                .should('have.value', 'CHUAU-4')

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'CHARD')
                    .next()
                        .should('have.value', 'COLLARDS')
                    .next()
                        .should('have.value', 'KALE')
                    .next()
                        .should('have.value', 'LETTUCE-RED')

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')
        })

        it('disables the filters while a row is being edited', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .should('be.disabled')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .should('be.disabled')
        })

        it('filters are no longer disabled when cancel button is clicked', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()
            cy.get('[data-cy=cancel-button-r0]')
                .should('exist')
                .click()
            
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .should('not.be.disabled')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .should('not.be.disabled')
        })

        it('filters are no longer disabled when save button is clicked', () => {
            cy.get('[data-cy=edit-button-r0]').last()
                .click()
            cy.get('[data-cy=save-button-r0]')
                .should('exist')
                .click()
            
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .should('not.be.disabled')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .should('not.be.disabled')
        })
    })

    context('edit and delete buttons work', () => {
        let logID = 0

        beforeEach(() => {
            cy.wrap(getSessionToken())
            .then(sessionToken => {
                token = sessionToken
                req = {
                    url: '/log',
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN' : token,
                    },
                    body: {
                        "name": "2019-03-27 TESTING CHUAU-2",
                        "type": "farm_transplanting",
                        "timestamp": "1553644800",
                        "done": "1", 
                        "notes": {
                            "value": "<p>Testing Transplanting Report</p>\n",
                            "format": "farm_format"
                        },
                        "asset": [{ 
                            "id": "235",
                            "resource": "farm_asset"
                        }],
                        "log_category": [{
                            "id": "242",
                            "resource": "taxonomy_term"
                        }],
                        "movement": {
                            "area": [{
                                "id": "182",
                                "resource": "taxonomy_term"
                            }]
                        },
                        "quantity": [
                            {
                                "measure": "length", 
                                "value": "3",  
                                "unit": {
                                    "id": "20", 
                                    "resource": "taxonomy_term"
                                },
                                "label": "Amount planted"
                            },
                            {
                                "measure": "ratio", 
                                "value": "3", 
                                "unit": {
                                    "id": "38",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Rows/Bed"
                            },
                            {
                                "measure": "count", 
                                "value": "2", 
                                "unit": {
                                    "id": "12",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Flats"
                            },
                            {
                                "measure": "time", 
                                "value": "1",  
                                "unit": {
                                    "id": "29",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Labor"
                            },
                            {
                                "measure": "count", 
                                "value": "1",
                                "unit": {
                                    "id": "15",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Workers"
                            },
                        ],
                        "created": "1553644800",
                        "uid": {
                            "id": "11",
                            "resource": "user"
                        },
                        "log_owner": [{
                            "id": "11",
                            "resource": "user"
                        }],
                        "data": "{\"crop_tid\": \"166\"}"
                    }
                }

                cy.request(req).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID = response.body.id
                })
            })
            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2019-03-27')
            cy.get('[data-cy=end-date-select]')
                .should('exist')
                .type('2019-03-27')
            cy.get('[data-cy=generate-rpt-btn]').first()
                .click()
        })

        it('edits the database when a row is edited in the table', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()   
            cy.get('[data-cy=date-input-r0c0]')
                .type('2001-09-28')  
            cy.get('[data-cy=dropdown-input-r0c1]')
                .select('TOMATO')
            cy.get('[data-cy=dropdown-input-r0c2]')
                .select('A')
            cy.get('[data-cy=number-input-r0c3]')
                .clear()
                .type('40')
            cy.get('[data-cy=number-input-r0c4]')
                .clear()
                .type('100')

            cy.get('[data-cy=text-input-r0c9]')
                .clear()
                .type('New Comment')
                .blur()

            // Button is actionable, unfortunately it's not in view
            cy.get('[data-cy=save-button-r0]')
                .click({force:true})

            cy.wrap(getRecord('/log.json?type=farm_transplanting&id=' + logID)).as('check')
            cy.get('@check').should(function(response) {
                expect(response.data.list[0].name).to.equal('2019-03-27 TESTING CHUAU-2')
            })
                .then(() => {
                    cy.wrap(deleteRecord("/log/" + logID , token)).as('transplantingDelete')
                })
            cy.get('@transplantingDelete').should((response) => {
                expect(response.status).to.equal(200)
            })
        })

        it('deletes a log from the database when the delete button is pressed', () => {
            cy.get('[data-cy=delete-button-r0]')
                .click((response) => {
                    expect(response.status).to.equal(200)
                })
        })
    })

    context('make sure any APIs that fail on page load make the API failed alert appear', () => {
        beforeEach(() => {
            cy.login('manager1', 'farmdata2')
            
        })
        
        it('fail the session token API: outside of 2xx error code', () => {
            cy.intercept('GET', 'restws/session/token', { statusCode: 500 }).as('failedSessionTok')

            cy.visit('/farm/fd2-barn-kit/transplantingReport')
            cy.wait('@failedSessionTok')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .click()
                    .should('not.visible')
                }) 
        })

        it('fail the session token API: network error', () => {
            cy.intercept('GET', 'restws/session/token', { forceNetworkError: true }).as('failedSessionTok')

            cy.visit('/farm/fd2-barn-kit/transplantingReport')
            cy.wait('@failedSessionTok')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    .click()
                    .should('not.visible')
                }) 
        })

        // if something else happens while setting up the request
        // then it would also be handled here. 
        // it('fail the session token API: something happened that triggered an error', () => {
        // })

        it('fail the crop map API: outside of 2xx error code', () => {
            cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1', { statusCode: 500 }).as('failedCropMap')

            cy.visit('/farm/fd2-barn-kit/transplantingReport')
            cy.wait('@failedCropMap')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .click()
                    .should('not.visible')
                }) 
        })

        it('fail the crop map API: network error', () => {
            cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1', { forceNetworkError: true }).as('failedCropMap')

            cy.visit('/farm/fd2-barn-kit/transplantingReport')
            cy.wait('@failedCropMap')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .click()
                    .should('not.visible')
                }) 
        })

        // if something else happens while setting up the request
        // then it would also be handled here. 
        // it('fail the crop map API: something happened that triggered an error', () => {
        // })

        it('fail the user map API: outside of 2xx error code', () => {
            cy.intercept('GET', 'user', { statusCode: 500 }).as('failedUserMap')

            cy.visit('/farm/fd2-barn-kit/transplantingReport')         
            cy.wait('@failedUserMap')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .click()
                    .should('not.visible')
                }) 
        })

        it('fail the user map API: network error', () => {
            cy.intercept('GET', 'user', { forceNetworkError: true }).as('failedUserMap')

            cy.visit('/farm/fd2-barn-kit/transplantingReport')         
            cy.wait('@failedUserMap')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .click()
                    .should('not.visible')
                }) 
        })

        // if something else happens while setting up the request
        // then it would also be handled here. 
        // it('fail the user map API: something happened that triggered an error', () => {
        // })
        
        it('fail the area map API: outside of 2xx error code', () => {
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas', { statusCode: 500 }).as('failedAreaMap') 

            cy.visit('/farm/fd2-barn-kit/transplantingReport')
            cy.wait('@failedAreaMap')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .click()
                    .should('not.visible')
                }) 
        })

        it('fail the area map API: outside of network error', () => {
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas', { forceNetworkError: true }).as('failedAreaMap') 

            cy.visit('/farm/fd2-barn-kit/transplantingReport')
            cy.wait('@failedAreaMap')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .click()
                    .should('not.visible')
                }) 
        })

        // if something else happens while setting up the request
        // then it would also be handled here. 
        // it('fail the area map API: something happened that triggered an error', () => {
        // })

        it('fail the unit map API: outside of 2xx error code', () => {
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units', { statusCode: 500 }).as('failedUnitMap')

            cy.visit('/farm/fd2-barn-kit/transplantingReport')
            cy.wait('@failedUnitMap')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .click()
                    .should('not.visible')
            }) 
        })
    
            it('fail the session token API: network error', () => {
                cy.intercept('GET', 'restws/session/token', { forceNetworkError: true }).as('failedSessionTok')
    
                cy.visit('/farm/fd2-barn-kit/transplantingReport')
                cy.wait('@failedSessionTok')
                    .then(() => {
                        cy.get('[data-cy=alert-err-handler]')
        
                }) 
        })

        it('fail the unit map API: network error', () => {
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units', { forceNetworkError: true }).as('failedUnitMap')

            cy.visit('/farm/fd2-barn-kit/transplantingReport')
            cy.wait('@failedUnitMap')
                .then(() => {
                    cy.get('[data-cy=alert-err-handler]')
                    .should('be.visible')
                    cy.window().its('scrollY').should('equal', 0)
                    cy.get('[data-cy=alert-err-handler]')
                    .click()
                    .should('not.visible')
                }) 
        })

        // if something else happens while setting up the request
        // then it would also be handled here. 
        // it('fail the unit map API: something happened that triggered an error', () => {
        // })
    })

    context('Configuration tests', () => {
        before(() =>{
            cy.login('manager1', 'farmdata2')
            .then(() => {
                cy.wrap(getConfiguration()).as('def')
                cy.wrap(getSessionToken()).as('token')
            }) 
            cy.get('@token').should(function(token) {
                sessionToken = token
            })
            cy.get('@def').should(function(map) {
                configMap = map.data
                defaultConfig = configMap
            })
        })

        beforeEach(() => {
            cy.login('manager1', 'farmdata2')
            .then(() => {
                cy.wrap(getSessionToken()).as('token')
            })
            cy.get('@token').should(function(token) {
                sessionToken = token
            })
            .then(() => {
                cy.wrap(setConfiguration(testConfig, sessionToken)).as('updateConfig')
            })
            cy.get('@updateConfig') 
            .then(() => {
                cy.wrap(getConfiguration()).as('getNewConfigMap')
            })          
            // set up intercept for setting up the configuration
            cy.get('@getNewConfigMap').should(function(map) {
                configMap = map.data
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
            cy.intercept('GET', 'restws/session/token').as('sessiontok')
            cy.intercept('GET', 'user').as('usermap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap')        
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitmap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_log_categories').as('logtypemap')            
            cy.intercept('GET', '/fd2_config/1').as('getConfigMap')       
            
            cy.visit('/farm/fd2-barn-kit/transplantingReport')

            cy.wait(['@cropmap', '@areamap', '@cropmap', '@usermap', '@areamap', '@unitmap',])
        })

        afterEach(() => {
            cy.wrap(setConfiguration(defaultConfig, sessionToken)).as('resetConfig')
            cy.get('@resetConfig')
        })

        it('test labor required', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-04-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Bed Feet')
            cy.get('[data-cy=h4]')
                .should('have.text', 'Row Feet')
            cy.get('[data-cy=h5]')
                .should('have.text', 'Rows/Bed')
            cy.get('[data-cy=h6]')
                .should('have.text', 'Trays')
            cy.get('[data-cy=h7]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h8]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h9]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h10]')
                .should('have.text', 'User')
            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')
            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')
        })

        it('test labor optional', () => {
            OptionalConfig = {id: 1, labor: 'Optional'}
            cy.wrap(setConfiguration(OptionalConfig, sessionToken)).as('updateConfig')
            cy.get('@updateConfig')
            .then(() => {
                cy.reload()
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'restws/session/token').as('sessiontok')
            cy.intercept('GET', 'user').as('usermap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitmap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_log_categories').as('logtypemap')

            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-04-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
                cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Bed Feet')
            cy.get('[data-cy=h4]')
                .should('have.text', 'Row Feet')
            cy.get('[data-cy=h5]')
                .should('have.text', 'Rows/Bed')
            cy.get('[data-cy=h6]')
                .should('have.text', 'Trays')
            cy.get('[data-cy=h7]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h8]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h9]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h10]')
                .should('have.text', 'User')
            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')
            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')
        })

        it('test labor hidden', () => {
            hiddenConfig = {id: 1, labor: 'Hidden'}
            cy.wrap(setConfiguration(hiddenConfig, sessionToken)).as('updateConfig')
            cy.get('@updateConfig')
            .then(() => {
                cy.reload()
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'restws/session/token').as('sessiontok')
            cy.intercept('GET', 'user').as('usermap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitmap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_log_categories').as('logtypemap')

            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-04-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
                cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Bed Feet')
            cy.get('[data-cy=h4]')
                .should('have.text', 'Row Feet')
            cy.get('[data-cy=h5]')
                .should('have.text', 'Rows/Bed')
            cy.get('[data-cy=h6]')
                .should('have.text', 'Trays')
            cy.get('[data-cy=h7]')
                .should('not.exist')
            cy.get('[data-cy=h8]')
                .should('not.exist')
            cy.get('[data-cy=h9]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h10]')
                .should('have.text', 'User')
            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')
            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')
        })
    })
})
