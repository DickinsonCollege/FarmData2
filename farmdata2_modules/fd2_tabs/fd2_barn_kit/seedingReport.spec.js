const dayjs = require('dayjs')
var FarmOSAPI = require('../resources/FarmOSAPI.js')
var getSessionToken = FarmOSAPI.getSessionToken
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var getIDToCropMap = FarmOSAPI.getIDToCropMap
var getAreaToIDMap = FarmOSAPI.getAreaToIDMap
var getUserToIDMap = FarmOSAPI.getUserToIDMap
var getUnitToIDMap = FarmOSAPI.getUnitToIDMap
var createRecord = FarmOSAPI.createRecord
var getRecord = FarmOSAPI.getRecord
var deleteRecord = FarmOSAPI.deleteRecord
var getConfiguration = FarmOSAPI.getConfiguration
var setConfiguration = FarmOSAPI.setConfiguration

describe('Testing for the seeding report page', () => {
    let cropToIDMap = null
    let IDToCropMap = null
    let areaToIDMap = null
    let userToIDMap = null
    let unitToIDMap = null
    let defaultConfig = null
    let testConfig = { id: "1", labor: 'Required' }

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
            .then(() => {
                // Using wrap to wait for the asynchronus API request.
                cy.wrap(getCropToIDMap()).as('cropMap')
                cy.wrap(getAreaToIDMap()).as('areaMap')
                cy.wrap(getIDToCropMap()).as('IDCropMap')
                cy.wrap(getUserToIDMap()).as('userMap')
                cy.wrap(getUnitToIDMap()).as('unitMap')
                cy.wrap(getSessionToken()).as('token')
            })
        // Wait here for the maps in the tests.
        cy.get('@token').should(function(token) {
            sessionToken = token
        })
        cy.get('@cropMap').should(function(map) {
            cropToIDMap = map
        })
        cy.get('@areaMap').should(function(map) {
            areaToIDMap = map
        })
        cy.get('@IDCropMap').should(function(map) {
            IDToCropMap = map
        })
        cy.get('@userMap').should(function(map) {
            userToIDMap = map
        })
        cy.get('@unitMap').should(function(map) {
            unitToIDMap = map
        })
        
        // Setting up wait for the request in the created() to complete.
        cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
        cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap') 
        cy.intercept('GET', '/taxonomy_term.json?bundle=farm_crops').as('IDCropMap')
        cy.intercept('GET', 'user').as('userMap') 
        cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitMap') 
        
        // cy.restoreLocalStorage()
        cy.visit('/farm/fd2-barn-kit/seedingReport')
    
        // Wait here for the maps to load in the page.   
        cy.wait(['@cropmap', '@areamap', '@IDCropMap', '@userMap', '@unitMap'])
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

            cy.get('[data-cy=direct-summary]')
                .should('exist')

            cy.get('[data-cy=tray-summary]')
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

            cy.intercept('GET', '/log.json?type=farm_seeding&timestamp[ge]=1546300800&timestamp[le]=1551398400', { statusCode: 500 })
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

            cy.get('[data-cy=direct-summary]')
                .should('not.exist')

            cy.get('[data-cy=tray-summary]')
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

            cy.intercept('GET', '/log.json?type=farm_seeding&timestamp[ge]=1546300800&timestamp[le]=1551398400', { forceNetworkError: true })
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

            cy.get('[data-cy=direct-summary]')
                .should('not.exist')

            cy.get('[data-cy=tray-summary]')
                .should('not.exist')
        }) 
    })

    context('assures filters are actually populated', () => {

        it('test if seeding type are correctly loaded to the filter dropdown', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'All')
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()  
                .next()
                .should('have.value', 'Direct Seedings')
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .last()
                .should('have.value', 'Tray Seedings')
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', '3')
        })

        it('test if crops are correctly loaded to the filter dropdown', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'All')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()  
                .next()
                .should('have.value', 'ARUGULA')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .last()
                .should('have.value', 'SCALLION')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', '22')
        })

        it('test if areas are correctly loaded to the filter dropdown', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'All')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()  
                .next()
                .should('have.value', 'A')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .last()
                .should('have.value', 'SEEDING BENCH')
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
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=loader]').should('be.visible')
        })

        it('spinner dissappears after whole response returns 1 page', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-02-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=report-table]').find('tr').its('length').then(length =>{
                expect(length).to.equal(3)
                cy.get('[data-cy=loader]').should('not.exist')
            }) 
        })

        it('spinner reappears after changing values and clicking again', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-03')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=loader]').should('be.visible')
        })
    })

    context('clicking on date ranges hides report', () => {
        beforeEach(() => {
            //cy.visit('/farm/fd2-barn-kit/seedingReport')
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
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
                .type('2019-03-01')
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

    context('can see summary tables at appropriate times and displays appropriate message', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('does not immediately display summary tables', () => {
            cy.get('[data-cy=tray-summary]').should('not.exist')
            cy.get('[data-cy=direct-summary]').should('not.exist')
        })

        it('shows summary tables after table is fully loaded', () => {
            cy.get('[data-cy=report-table]')
            cy.get('[data-cy=tray-summary]',).should('be.visible')
            cy.get('[data-cy=direct-summary]').should('be.visible')
        }) 

        it('show tray seeding message when only direct seeding', () => {
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('CARROT')
            cy.get('[data-cy=tray-no-logs')
                .should('have.text', 'There are no Tray Seeding logs with these parameters')
        })

        it('show direct seeding message when only tray seeding', () => {
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('BOKCHOY')
            cy.get('[data-cy=direct-no-logs')
                .should('have.text', 'There are no Direct Seeding logs with these parameters')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('All')
        })

        it('show one summary table with specific seeding type', () => {
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
            .select('Direct Seedings')
            cy.get('[data-cy=direct-summary').should('exist')
            cy.get('[data-cy=tray-summary]').should('not.exist')

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
            .select('Tray Seedings')
            cy.get('[data-cy=direct-summary').should('not.exist')
            cy.get('[data-cy=tray-summary]').should('exist')
        })
    })

    context('displays the right information in the table', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()

            cy.get('[data-cy=report-table]').find('tr').its('length')
                .then(length =>{
                    expect(length).to.equal(35)
                })
        })

        it('requests and displays logs that fall between the specified dates', () => {
            let currentTimestamp = null
            const startTimestamp = dayjs('2019-01-01').unix()
            const endTimestamp = dayjs('2019-03-01').unix()

            for(let r = 0; r < 34; r++){
                cy.get('[data-cy=r' + r + 'c0')
                    .invoke('text')
                    .then(dateText => {
                        currentTimestamp = dayjs(dateText).unix()
                        expect(currentTimestamp).is.within(startTimestamp, endTimestamp)
                    })
            }
        })

        it('filters by type of seeding', () => {
            let typeSeeding = null
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')

            for(let r = 0; r < 7; r++){
                cy.get('[data-cy=r' + r + 'c3')
                    .invoke('text')
                    .then(seeding => {
                        typeSeeding = seeding
                        expect(typeSeeding, 'Direct')
                    })
            }

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')

            for(let r = 0; r < 27; r++){
                cy.get('[data-cy=r' + r + 'c3')
                    .invoke('text')
                    .then(seeding => {
                        typeSeeding = seeding
                        expect(typeSeeding, 'Tray')
                    })
            }

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')
        })

        it('filters by crop', () => {
            let crop = null
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('LEEK')
                .should('have.value', 'LEEK')


            for(let r = 0; r < 3; r++){
                cy.get('[data-cy=r' + r + 'c1')
                    .invoke('text')
                    .then(actualCrop => {
                        crop = actualCrop
                        expect(crop, 'LEEK')
                    })
            }

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')
        })

        it('filters by field', () => {
            let area = null
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .select('SEEDING BENCH')
                .should('have.value', 'SEEDING BENCH')

            for(let r = 0; r < 27; r++){
                cy.get('[data-cy=r' + r + 'c2')
                    .invoke('text')
                    .then(actualArea => {
                        area = actualArea
                        expect(area, 'SEEDING BENCH')
                    })
            }
            
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')
            })
        })

    context('has the correct totals in the seeding summary tables', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('verify all values in the direct seeding summary', () => {
            cy.get('[data-cy=direct-total-rowft]')
            .should('have.text', '26177')

            cy.get('[data-cy=direct-total-bedft]')
            .should('have.text', '8803')

            cy.get('[data-cy=direct-total-hours]')
            .should('have.text', '2.1')

            cy.get('[data-cy=direct-total-rowft-hour]')
            .should('have.text', '4191.9')

            cy.get('[data-cy=direct-total-bedfr-hour]')
            .should('have.text', '4191.9')
            })

        it('verify all values in the tray seeding summary', () => {
            cy.get('[data-cy=tray-total-seeds]')
            .should('have.text', '16808')
    
            cy.get('[data-cy=tray-total-trays]')
            .should('have.text', '212.5')
    
            cy.get('[data-cy=tray-total-seeds-hour]')
            .should('have.text', '8.1')
    
            cy.get('[data-cy=tray-avg-seeds-hour]')
            .should('have.text', '2075.06')
        })
    })

    context('has the correct totals in the seeding summary tables with hidden labor config', () => {
        let logID = 0
        let logID2 = 0
        let logIDTray = 0
        let logIDTray2 = 0
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
                        "name": "TEST SEEDING",
                        "type": "farm_seeding",
                        "timestamp": dayjs('1999-10-06').unix(),
                        "done": "1",  //any seeding recorded is done.
                        "notes": {
                            "value": "This is a test log",
                            "format": "farm_format"
                        },
                        "asset": [{ 
                            "id": "1",   //Associated planting
                            "resource": "farm_asset"
                        }],
                        "log_category": [{
                            "id": "240",
                            "resource": "taxonomy_term"
                        }],
                        "movement": {
                            "area": [{
                                "id": "233",
                                "resource": "taxonomy_term"
                            }]
                        },
                        "quantity": [
                            {
                                "measure": "length", 
                                "value": "5",  //total row feet
                                "unit": {
                                    "id": "20", 
                                    "resource": "taxonomy_term"
                                },
                                "label": "Amount planted"
                            },
                            {
                                "measure": "ratio", 
                                "value": "5",
                                "unit": {
                                    "id": "38",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Rows/Bed"
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
                        "lot_number": "N/A (No Variety)",
                        "data": "1"
                    }
                }
                
                reqTray = {
                    url: '/log',
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN' : token,
                    },
                    body: {
                        "name": "TEST SEEDING",
                        "type": "farm_seeding",
                        "timestamp": dayjs('1999-10-06').unix(),
                        "done": "1",  //any seeding recorded is done.
                        "notes": {
                            "value": "This is a test log",
                            "format": "farm_format"
                        },
                        "asset": [{ 
                            "id": "1",   //Associated planting
                            "resource": "farm_asset"
                        }],
                        "log_category": [{
                            "id": "241",    //Tray Seeding
                            "resource": "taxonomy_term"
                        }],
                        "movement": {
                            "area": [{
                                "id": "178",
                                "resource": "taxonomy_term"
                            }]
                        },
                        "quantity": [
                            {
                                "measure": "count", 
                                "value": "5",  //cells per tray
                                "unit": {
                                    "id": "17", 
                                    "resource": "taxonomy_term"
                                },
                                "label": "Seeds planted"
                            },
                            {
                                "measure": "count", 
                                "value": "5",
                                "unit": {
                                    "id": "12", //Flats used
                                    "resource": "taxonomy_term"
                                },
                                "label": "Flats used"
                            },
                            {
                                "measure": "ratio", 
                                "value": "5",
                                "unit": {
                                    "id": "37", //Cells per flat
                                    "resource": "taxonomy_term"
                                },
                                "label": "Cells/Flat"
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
                        "lot_number": "N/A (No Variety)",
                        "data": "1"
                    }
                }
                cy.request(req).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID = response.body.id
                })
                cy.request(reqTray).as('create2')
                cy.get('@create2').should(function(response) {
                    expect(response.status).to.equal(201)
                    logIDTray = response.body.id
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
            cy.wrap(deleteRecord("/log/" + logID , sessionToken)).as('seedingDelete')
            cy.get('@seedingDelete').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })

            cy.wrap(deleteRecord("/log/" + logIDTray , sessionToken)).as('seedingDeletetray')
            cy.get('@seedingDeletetray').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })

        })

        it('test Direct Seeding Summary table values when all logs have no labor data', () => {
            req2 = {
                url: '/log',
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN' : token,
                },
                body: {
                    "name": "TEST SEEDING",
                    "type": "farm_seeding",
                    "timestamp": dayjs('1999-10-06').unix(),
                    "done": "1",  //any seeding recorded is done.
                    "notes": {
                        "value": "This is a test log",
                        "format": "farm_format"
                    },
                    "asset": [{ 
                        "id": "1",   //Associated planting
                        "resource": "farm_asset"
                    }],
                    "log_category": [{
                        "id": "240",
                        "resource": "taxonomy_term"
                    }],
                    "movement": {
                        "area": [{
                            "id": "233",
                            "resource": "taxonomy_term"
                        }]
                    },
                    "quantity": [
                        {
                            "measure": "length", 
                            "value": "5",  //total row feet
                            "unit": {
                                "id": "20", 
                                "resource": "taxonomy_term"
                            },
                            "label": "Amount planted"
                        },
                        {
                            "measure": "ratio", 
                            "value": "5",
                            "unit": {
                                "id": "38",
                                "resource": "taxonomy_term"
                            },
                            "label": "Rows/Bed"
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
                    "lot_number": "N/A (No Variety)",
                    "data": "1"
                }
            }
            cy.request(req2).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID2 = response.body.id
                })

            cy.get('[data-cy=start-date-select]')
            .type('1999-10-06')
            cy.get('[data-cy=end-date-select]')
            .type('1999-10-07')
            cy.get('[data-cy=generate-rpt-btn]')
            .click()
            cy.get('[data-cy=direct-total-rowft]')
                .should('have.text', '10')

            cy.get('[data-cy=direct-total-bedft]')
            .should('have.text', '2')

            cy.get('[data-cy=direct-total-hours]')
            .should('have.text', '0')

            cy.get('[data-cy=direct-total-rowft-hour]')
            .should('have.text', 'N/A')

            cy.get('[data-cy=direct-total-bedfr-hour]')
            .should('have.text', 'N/A')
            .then(() => {
                cy.wrap(deleteRecord("/log/" + logID2 , sessionToken)).as('seedingDelete2')
            })
            cy.get('@seedingDelete2').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })
        })

        it('test Tray Seeding Summary table values when there are No labor data', () => {
            reqTray2 = {
                url: '/log',
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN' : token,
                },
                body: {
                    "name": "TEST SEEDING",
                    "type": "farm_seeding",
                    "timestamp": dayjs('1999-10-06').unix(),
                    "done": "1",  //any seeding recorded is done.
                    "notes": {
                        "value": "This is a test log",
                        "format": "farm_format"
                    },
                    "asset": [{ 
                        "id": "1",   //Associated planting
                        "resource": "farm_asset"
                    }],
                    "log_category": [{
                        "id": "241",    //Tray Seeding
                        "resource": "taxonomy_term"
                    }],
                    "movement": {
                        "area": [{
                            "id": "178",
                            "resource": "taxonomy_term"
                        }]
                    },
                    "quantity": [
                        {
                            "measure": "count", 
                            "value": "5",  //cells per tray
                            "unit": {
                                "id": "17", 
                                "resource": "taxonomy_term"
                            },
                            "label": "Seeds planted"
                        },
                        {
                            "measure": "count", 
                            "value": "5",
                            "unit": {
                                "id": "12", //Flats used
                                "resource": "taxonomy_term"
                            },
                            "label": "Flats used"
                        },
                        {
                            "measure": "ratio", 
                            "value": "5",
                            "unit": {
                                "id": "37", //Cells per flat
                                "resource": "taxonomy_term"
                            },
                            "label": "Cells/Flat"
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
                    "lot_number": "N/A (No Variety)",
                    "data": "1"
                }
                
            }

            cy.request(reqTray2).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logIDTray2 = response.body.id
                })
            cy.get('[data-cy=start-date-select]')
            .type('1999-10-06')
            cy.get('[data-cy=end-date-select]')
            .type('1999-10-07')
            cy.get('[data-cy=generate-rpt-btn]')
            .click()

            cy.get('[data-cy=tray-total-seeds]')
            .should('have.text', '10')
    
            cy.get('[data-cy=tray-total-trays]')
            .should('have.text', '10')
    
            cy.get('[data-cy=tray-total-seeds-hour]')
            .should('have.text', '0')
    
            cy.get('[data-cy=tray-avg-seeds-hour]')
            .should('have.text', 'N/A')
            .then(() => {
                cy.wrap(deleteRecord("/log/" + logIDTray2 , sessionToken)).as('seedingDeletetray2')
            })
            cy.get('@seedingDeletetray2').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })    
        })

        it('test Direct Seeding Summary table values when there are mixed labor data', () => {
            req2 = {
                url: '/log',
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN' : token,
                },
                body: {
                    "name": "TEST SEEDING",
                    "type": "farm_seeding",
                    "timestamp": dayjs('1999-10-06').unix(),
                    "done": "1",  //any seeding recorded is done.
                    "notes": {
                        "value": "This is a test log",
                        "format": "farm_format"
                    },
                    "asset": [{ 
                        "id": "1",   //Associated planting
                        "resource": "farm_asset"
                    }],
                    "log_category": [{
                        "id": "240",
                        "resource": "taxonomy_term"
                    }],
                    "movement": {
                        "area": [{
                            "id": "233",
                            "resource": "taxonomy_term"
                        }]
                    },
                    "quantity": [
                        {
                            "measure": "length", 
                            "value": "5",  //total row feet
                            "unit": {
                                "id": "20", 
                                "resource": "taxonomy_term"
                            },
                            "label": "Amount planted"
                        },
                        {
                            "measure": "ratio", 
                            "value": "5",
                            "unit": {
                                "id": "38",
                                "resource": "taxonomy_term"
                            },
                            "label": "Rows/Bed"
                        },
                        {
                            "measure": "time", 
                            "value": "2", 
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
                    "lot_number": "N/A (No Variety)",
                    "data": "1"
                }    
            }

            cy.request(req2).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID2 = response.body.id
                })

            cy.get('[data-cy=start-date-select]')
            .type('1999-10-06')
            cy.get('[data-cy=end-date-select]')
            .type('1999-10-07')
            cy.get('[data-cy=generate-rpt-btn]')
            .click()
        
            cy.get('[data-cy=direct-total-rowft]')
                .should('have.text', '10')

            cy.get('[data-cy=direct-total-bedft]')
            .should('have.text', '2')

            cy.get('[data-cy=direct-total-hours]')
            .should('have.text', '4')

            cy.get('[data-cy=direct-total-rowft-hour]')
            .should('have.text', '0.25')

            cy.get('[data-cy=direct-total-bedfr-hour]')
            .should('have.text', '0.25')
            .then(() => {
                cy.wrap(deleteRecord("/log/" + logID2 , sessionToken)).as('seedingDelete2')
            })
            cy.get('@seedingDelete2').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })
        })

        it('test Tray Seeding Summary table values when there are mixed labor data', () => {
            reqTray2 = {
                url: '/log',
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN' : token,
                },
                body: {
                    "name": "TEST SEEDING",
                    "type": "farm_seeding",
                    "timestamp": dayjs('1999-10-06').unix(),
                    "done": "1",  //any seeding recorded is done.
                    "notes": {
                        "value": "This is a test log",
                        "format": "farm_format"
                    },
                    "asset": [{ 
                        "id": "1",   //Associated planting
                        "resource": "farm_asset"
                    }],
                    "log_category": [{
                        "id": "241",    //Tray Seeding
                        "resource": "taxonomy_term"
                    }],
                    "movement": {
                        "area": [{
                            "id": "178",
                            "resource": "taxonomy_term"
                        }]
                    },
                    "quantity": [
                        {
                            "measure": "count", 
                            "value": "5",  //cells per tray
                            "unit": {
                                "id": "17", 
                                "resource": "taxonomy_term"
                            },
                            "label": "Seeds planted"
                        },
                        {
                            "measure": "count", 
                            "value": "5",
                            "unit": {
                                "id": "12", //Flats used
                                "resource": "taxonomy_term"
                            },
                            "label": "Flats used"
                        },
                        {
                            "measure": "ratio", 
                            "value": "5",
                            "unit": {
                                "id": "37", //Cells per flat
                                "resource": "taxonomy_term"
                            },
                            "label": "Cells/Flat"
                        },
                        {
                            "measure": "time", 
                            "value": "60", 
                            "unit": {
                                "id": "29",
                                "resource": "taxonomy_term"
                            },
                            "label": "Labor"
                        },
                        {
                            "measure": "count", 
                            "value": "5", 
                            "unit": {
                                "id": "15",
                                "resource": "taxonomy_term"
                            },
                            "label": "Workers"
                        },
                    ],
                    "created": dayjs().unix(),
                    "lot_number": "N/A (No Variety)",
                    "data": "1"
                }
                
            }

            cy.request(reqTray2).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logIDTray2 = response.body.id
                })
            cy.get('[data-cy=start-date-select]')
            .type('1999-10-06')
            cy.get('[data-cy=end-date-select]')
            .type('1999-10-07')
            cy.get('[data-cy=generate-rpt-btn]')
            .click()

            cy.get('[data-cy=tray-total-seeds]')
            .should('have.text', '10')
    
            cy.get('[data-cy=tray-total-trays]')
            .should('have.text', '10')
    
            cy.get('[data-cy=tray-total-seeds-hour]')
            .should('have.text', '300')
    
            cy.get('[data-cy=tray-avg-seeds-hour]')
            .should('have.text', '0.02')
            .then(() => {
                cy.wrap(deleteRecord("/log/" + logIDTray2 , sessionToken)).as('seedingDeletetray2')
            })
            cy.get('@seedingDeletetray2').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })  
        })
    })
    

    context('changing the type of seeding changes the visible columns', () => {
        beforeEach(() => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('displays only columns relevant to both seedings when "All" is selected', () => {
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .should('have.value', 'All')
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')
            cy.get('[data-cy=h4]')
                .should('not.exist')
            cy.get('[data-cy=h5]')
                .should('not.exist')
            cy.get('[data-cy=h6]')
                .should('not.exist')
            cy.get('[data-cy=h7]')
                .should('not.exist')
            cy.get('[data-cy=h8]')
                .should('not.exist')
            cy.get('[data-cy=h9]')
                .should('not.exist')
            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')
            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h14]')
                .should('have.text', 'User')
            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')
            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')
        })

        it('displays columns relevant to direct seedings when "Direct Seedings" is selected', () => {
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')
            cy.get('[data-cy=h4]')
                .should('have.text', 'Row Feet')
            cy.get('[data-cy=h5]')
                .should('have.text', 'Bed Feet')
            cy.get('[data-cy=h6]')
                .should('have.text', 'Rows/Bed')
            cy.get('[data-cy=h7]')
                .should('not.exist')
            cy.get('[data-cy=h8]')
                .should('not.exist')
            cy.get('[data-cy=h9]')
                .should('not.exist')
            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')
            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h14]')
                .should('have.text', 'User')
            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')
            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')
            cy.get('[data-cy=save-header]')
                .should('not.exist')
            cy.get('[data-cy=cancel-header]')
                .should('not.exist')
        })

        it('displays columns relevant to direct seedings when "Direct Seedings" is selected and in edit mode', () => {
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')
            cy.get('[data-cy=edit-button-r0]').first()
                .click()
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')
            cy.get('[data-cy=h4]')
                .should('have.text', 'Row Feet')
            cy.get('[data-cy=h5]')
                .should('have.text', 'Bed Feet')
            cy.get('[data-cy=h6]')
                .should('have.text', 'Rows/Bed')
            cy.get('[data-cy=h7]')
                .should('not.exist')
            cy.get('[data-cy=h8]')
                .should('not.exist')
            cy.get('[data-cy=h9]')
                .should('not.exist')
            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')
            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h14]')
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

        it('displays columns relevant to tray seedings when "Tray Seedings" is selected', () => {
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')
                cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')
            cy.get('[data-cy=h4]')
                .should('not.exist')
            cy.get('[data-cy=h5]')
                .should('not.exist')
            cy.get('[data-cy=h6]')
                .should('not.exist')
            cy.get('[data-cy=h7]')
                .should('have.text', 'Seeds')
            cy.get('[data-cy=h8]')
                .should('have.text', 'Trays')
            cy.get('[data-cy=h9]')
                .should('have.text', 'Cells/Tray')
            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')
            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h14]')
                .should('have.text', 'User')
            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')
            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')
            cy.get('[data-cy=save-header]')
                .should('not.exist')
            cy.get('[data-cy=cancel-header]')
                .should('not.exist')
        })

        it('displays columns relevant to tray seedings when "Tray Seedings" is selected and in edit mode', () => {
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')
            cy.get('[data-cy=edit-button-r0]').first()
                .click()
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')
            cy.get('[data-cy=h4]')
                .should('not.exist')
            cy.get('[data-cy=h5]')
                .should('not.exist')
            cy.get('[data-cy=h6]')
                .should('not.exist')
            cy.get('[data-cy=h7]')
                .should('have.text', 'Seeds')
            cy.get('[data-cy=h8]')
                .should('have.text', 'Trays')
            cy.get('[data-cy=h9]')
                .should('have.text', 'Cells/Tray')
            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')
            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h14]')
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
                .type('2019-02-13')
            cy.get('[data-cy=end-date-select]')
                .type('2019-02-16')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('updates crop and area options when a new seeding type has been selected', () => {
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'ARUGULA')
                    .next()
                        .should('have.value', 'CARROT')
                    .next()
                        .should('have.value', 'CHARD')
                    .next()
                        .should('have.value', 'ONION-FRESH')
                    .next()
                        .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'A')
                    .next()
                        .should('have.value', 'CHUAU-3')
                    .next()
                        .should('have.value', 'SEEDING BENCH')

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'CHARD')
                    .next()
                        .should('have.value', 'ONION-FRESH')
                    .next()
                        .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'SEEDING BENCH')

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')

        })

        it('updates seeding type and area options when a new crop has been selected', () => {
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'Direct Seedings')
                    .next()
                        .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'A')
                    .next()
                        .should('have.value', 'CHUAU-3')
                    .next()
                        .should('have.value', 'SEEDING BENCH')

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('SCALLION')
                .should('have.value', 'SCALLION')

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'SEEDING BENCH')

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')
        })

        it('updates seeding type and crop options when a new area has been selected', () => {
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'Direct Seedings')
                    .next()
                        .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'ARUGULA')
                    .next()
                        .should('have.value', 'CARROT')
                    .next()
                        .should('have.value', 'CHARD')
                    .next()
                        .should('have.value', 'ONION-FRESH')
                    .next()
                        .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .select('CHUAU')
                .should('have.value', 'CHUAU')

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'ONION-FRESH')
                    .next()
                        .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .select('All')
                .should('have.value', 'All')
        })

        it('disables the filters while a row is being edited', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .should('be.disabled')
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
            
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .should('not.be.disabled')
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
            
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .should('not.be.disabled')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .should('not.be.disabled')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .should('not.be.disabled')
        })
    })

    context.only('edit and delete buttons work', () => {
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
                        "name": "TEST SEEDING",
                        "type": "farm_seeding",
                        "timestamp": dayjs('2022-07-21').unix(),
                        "done": "1",  //any seeding recorded is done.
                        "notes": {
                            "value": "This is a test log",
                            "format": "farm_format"
                        },
                        "asset": [{ 
                            "id": "1",   //Associated planting
                            "resource": "farm_asset"
                        }],
                        "log_category": [{
                            "id": "240",
                            "resource": "taxonomy_term"
                        }],
                        "movement": {
                            "area": [{
                                "id": "233",
                                "resource": "taxonomy_term"
                            }]
                        },
                        "quantity": [
                            {
                                "measure": "length", 
                                "value": "5",  //total row feet
                                "unit": {
                                    "id": "20", 
                                    "resource": "taxonomy_term"
                                },
                                "label": "Amount planted"
                            },
                            {
                                "measure": "ratio", 
                                "value": "5",
                                "unit": {
                                    "id": "38",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Rows/Bed"
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
                        "created": dayjs().unix(),
                        "lot_number": "N/A (No Variety)",
                        "data": "{\"crop_tid\":\"142\"}"
                    }
                }

                cy.request(req).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID = response.body.id
                    console.log(logID)
                })
            })

            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2022-07-21')
            cy.get('[data-cy=end-date-select]')
                .should('exist')
                .type('2022-07-21')
            cy.get('[data-cy=generate-rpt-btn]').first()
                .click()
        })

        it('edits the database when a row is edited in the table', () => {
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
            .select('Direct Seedings')

            cy.get('[data-cy=edit-button-r0]')
                .click()   
            cy.get('[data-cy=date-input-r0c0]')
                .type('2022-07-20')  
            cy.get('[data-cy=dropdown-input-r0c1]')
                .select('TOMATO')
            // cy.get('[data-cy=dropdown-input-r0c2]')
            //     .select('A')
            cy.get('[data-cy=number-input-r0c4]')
                .type('2')

            cy.get('[data-cy=number-input-r0c10]')
                .type('4')
            cy.get('[data-cy=number-input-r0c11]')
                .type('2')

            cy.get('[data-cy=text-input-r0c13]')
                .type('Testing edit functionality')
                .blur()


            cy.intercept('PUT', 'log/' + logID).as('logUpdate')

            // Button is actionable, unfortunately it's not in view
            cy.get('[data-cy=save-button-r0]')
                .click({force:true})   

            cy.wait('@logUpdate') // wait for the log update
            .then(interception => {
                // read the response
                expect(interception.response.statusCode).to.eq(200)
            })

            console.log(logID)
            cy.wrap(getRecord('/log.json?type=farm_seeding&id=' + logID)).as('check')
            cy.get('@check').should(function(response) {
                expect(response.data.list[0].name).to.equal('TEST SEEDING')
                expect(response.data.list[0].quantity[0].value).to.equal('5')
                expect(response.data.list[0].quantity[1].value).to.equal('5')
                expect(response.data.list[0].quantity[2].value).to.equal('1')
                expect(response.data.list[0].quantity[3].value).to.equal('1')
            })
                .then(() => {
                    cy.wrap(deleteRecord("/log/" + logID , token)).as('seedingDelete')
                })
            cy.get('@seedingDelete').should((response) => {
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

            cy.visit('/farm/fd2-barn-kit/seedingReport')
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

            cy.visit('/farm/fd2-barn-kit/seedingReport')
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

            cy.visit('/farm/fd2-barn-kit/seedingReport')
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

            cy.visit('/farm/fd2-barn-kit/seedingReport')
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

            cy.visit('/farm/fd2-barn-kit/seedingReport')         
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

            cy.visit('/farm/fd2-barn-kit/seedingReport')         
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

            cy.visit('/farm/fd2-barn-kit/seedingReport')
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

            cy.visit('/farm/fd2-barn-kit/seedingReport')
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

            cy.visit('/farm/fd2-barn-kit/seedingReport')
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

        it('fail the unit map API: network error', () => {
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units', { forceNetworkError: true }).as('failedUnitMap')

            cy.visit('/farm/fd2-barn-kit/seedingReport')
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
            
            cy.visit('/farm/fd2-barn-kit/seedingReport')

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
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')
            cy.get('[data-cy=h4]')
                .should('not.exist')
            cy.get('[data-cy=h5]')
                .should('not.exist')
            cy.get('[data-cy=h6]')
                .should('not.exist')
            cy.get('[data-cy=h7]')
                .should('not.exist')
            cy.get('[data-cy=h8]')
                .should('not.exist')
            cy.get('[data-cy=h9]')
                .should('not.exist')
            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')
            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h14]')
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
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')
            cy.get('[data-cy=h4]')
                .should('not.exist')
            cy.get('[data-cy=h5]')
                .should('not.exist')
            cy.get('[data-cy=h6]')
                .should('not.exist')
            cy.get('[data-cy=h7]')
                .should('not.exist')
            cy.get('[data-cy=h8]')
                .should('not.exist')
            cy.get('[data-cy=h9]')
                .should('not.exist')
            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')
            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')
            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')
            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h14]')
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
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')
            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')
            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')
            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')
            cy.get('[data-cy=h4]')
                .should('not.exist')
            cy.get('[data-cy=h5]')
                .should('not.exist')
            cy.get('[data-cy=h6]')
                .should('not.exist')
            cy.get('[data-cy=h7]')
                .should('not.exist')
            cy.get('[data-cy=h8]')
                .should('not.exist')
            cy.get('[data-cy=h9]')
                .should('not.exist')
            cy.get('[data-cy=h10]')
                .should('not.exist')
            cy.get('[data-cy=h11]')
                .should('not.exist')
            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')
            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')
            cy.get('[data-cy=h14]')
                .should('have.text', 'User')
            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')
            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')
        })
    })
})
