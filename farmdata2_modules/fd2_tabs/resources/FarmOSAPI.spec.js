var FarmOSAPI = require("./FarmOSAPI.js")
var getAllPages = FarmOSAPI.getAllPages
var getSessionToken = FarmOSAPI.getSessionToken
var updateRecord = FarmOSAPI.updateRecord
var createRecord = FarmOSAPI.createRecord
var deleteRecord = FarmOSAPI.deleteRecord

var getIDToUserMap = FarmOSAPI.getIDToUserMap
var getIDToCropMap = FarmOSAPI.getIDToCropMap
var getIDToAreaMap = FarmOSAPI.getIDToAreaMap
var getIDToUnitMap = FarmOSAPI.getIDToUnitMap

var getUserToIDMap = FarmOSAPI.getUserToIDMap
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var getAreaToIDMap = FarmOSAPI.getAreaToIDMap
var getUnitToIDMap = FarmOSAPI.getUnitToIDMap

var quantityLocation = FarmOSAPI.quantityLocation

describe('API Request Function', () => {
    beforeEach(() => {
        cy.login('restws1', 'farmdata2')
    })

    afterEach(() => {
       // cy.logout()
    })

    context('getAllPages API request function', () => {
        it('Test on a request with one page.', () => {
            cy.intercept("GET",/log\?type=farm_seeding/).as('onlyone')

            let calls=0
            let testArray = []

            // This wait is a bit of a hack.  
            // Without it the first request is not intercepted.
            // There may be a more correct way to wait?
            cy.wait(1)
            .then(() => {
                cy.wait('@onlyone').then(() => {
                    calls++

                    // Need to wrap testArray here because it may 
                    // take a moment for the array to be set after the response
                    // is received. Wrapping lets use should which automatically
                    // retries the assertion.
                    cy.wrap(testArray).should(() => {
                        expect(testArray).to.have.length(50)
                    })
                })

                cy.wrap(getAllPages('/log?type=farm_seeding&id[le]=50', testArray)).as('onePage')
                cy.get('@onePage').should(() => {
                    expect(calls).to.equal(1)
                })
            })
        })

        it('Test on a request with multiple pages', () => {
            cy.intercept("GET","/log?type=farm_seeding&page=5").as('first')
            cy.intercept("GET","/log?type=farm_seeding&page=6").as('second')
            cy.intercept("GET","/log?type=farm_seeding&page=9").as('last')
        
            let firstCalls=0
            let secondCalls=0
            let lastCalls=0
            let testArray = []

            cy.wait(1)
            .then(function() {
                cy.wait('@first').then(() => {
                    firstCalls++
                    cy.wrap(testArray).should(() => {
                        expect(testArray).to.have.length(100)
                    })
                })

                cy.wait('@second').then(() => {
                    secondCalls++
                    cy.wrap(testArray).should(() => {
                        expect(testArray).to.have.length(200)
                    })
                })

                cy.wait('@last', {requestTimeout: 20000}).then(() => {
                    lastCalls++
                    cy.wrap(testArray).should(() => {
                        expect(testArray).to.have.length.gt(400)
                    })
                })

                cy.wrap(getAllPages("/log?type=farm_seeding&page=5", testArray)).as('multiPage')
                cy.get('@multiPage').should(() => {
                    expect(firstCalls).to.equal(1)
                    expect(secondCalls).to.equal(1)
                    expect(lastCalls).to.equal(1)
                })
            })
        })
    })
    
    context('test maping functions', () => {
        it('getIDToUserMap creates correct map with the correct length', () => {
            cy.wrap(getIDToUserMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
                expect(idToNameMap.size).to.equal(11)
                expect(idToNameMap.get('1')).to.equal('admin')
                expect(idToNameMap.get('6')).to.equal('manager1')
                expect(idToNameMap.get('8')).to.equal('worker1')
                expect(idToNameMap.get('13')).to.equal('guest')
                expect(idToNameMap.get('14')).to.equal('restws1')
            })
        })
        
        it('getUserToIDMap creates correct map with the correct length', () => {
            cy.wrap(getUserToIDMap()).as('map')
            cy.get('@map').should((nameToIdMap) => {
                expect(nameToIdMap).to.not.be.null
                expect(nameToIdMap).to.be.a('Map')
                expect(nameToIdMap.size).to.equal(11)
                expect(nameToIdMap.get('admin')).to.equal('1')
                expect(nameToIdMap.get('manager1')).to.equal('6')
                expect(nameToIdMap.get('worker1')).to.equal('8')
                expect(nameToIdMap.get('guest')).to.equal('13')
                expect(nameToIdMap.get('restws1')).to.equal('14')
            })
        })

        it('getIDToCropMap creates correct map with the correct length', () => {
            cy.wrap(getIDToCropMap(), {timeout: 15000}).as('map')
            cy.get('@map').should((idToCropMap) => {
                expect(idToCropMap).to.not.be.null
                expect(idToCropMap).to.be.a('Map')
                expect(idToCropMap.size).to.equal(111)

                // first and last on first page of response
                expect(idToCropMap.get('139')).to.equal('ARUGULA')
                expect(idToCropMap.get('86')).to.equal('STRAWBERRY')

                // first and last on second page of response
                expect(idToCropMap.get('206')).to.equal('SUNFLOWER SEEDS')
                expect(idToCropMap.get('115')).to.equal('ZUCCHINI')

                // test some compound names too
                expect(idToCropMap.get('193')).to.equal('ONION-SPRING')
                expect(idToCropMap.get('172')).to.equal('CORN-SWEET')
            })
        })

        it('getCropToIDMap creates correct map with the correct length', () => {
            cy.wrap(getCropToIDMap(), {timeout: 15000}).as('map')
            cy.get('@map').should((cropToIdMap) => {
                expect(cropToIdMap).to.not.be.null
                expect(cropToIdMap).to.be.a('Map')
                expect(cropToIdMap.size).to.equal(111)
                expect(cropToIdMap.get('ARUGULA')).to.equal('139')
                expect(cropToIdMap.get('STRAWBERRY')).to.equal('86')
                expect(cropToIdMap.get('SUNFLOWER SEEDS')).to.equal('206')
                expect(cropToIdMap.get('ZUCCHINI')).to.equal('115')            
                expect(cropToIdMap.get('ONION-SPRING')).to.equal('193')
                expect(cropToIdMap.get('CORN-SWEET')).to.equal('172')        
            })
        })

        it('getIDToAreaMap creates correct map with the correct length', () => {
            cy.wrap(getIDToAreaMap(), {timeout: 15000}).as('map')
            cy.get('@map').should((idToAreaMap) => {
                expect(idToAreaMap).to.not.be.null
                expect(idToAreaMap).to.be.a('Map')
                expect(idToAreaMap.size).to.equal(70)

                // Check first and last
                expect(idToAreaMap.get('7')).to.equal('A')
                expect(idToAreaMap.get('76')).to.equal('Z')

                // Check some sub-areas too
                expect(idToAreaMap.get('15')).to.equal('CHUAU')
                expect(idToAreaMap.get('16')).to.equal('CHUAU-1')
                expect(idToAreaMap.get('20')).to.equal('CHUAU-5')
            })
        })

        it('getAreaToIDMap creates correct map with the correct length', () => {
            cy.wrap(getAreaToIDMap(), {timeout: 15000}).as('map')
            cy.get('@map').should((idToAreaMap) => {
                expect(idToAreaMap).to.not.be.null
                expect(idToAreaMap).to.be.a('Map')
                expect(idToAreaMap.size).to.equal(70)

                expect(idToAreaMap.get('A')).to.equal('7')
                expect(idToAreaMap.get('Z')).to.equal('76')
                expect(idToAreaMap.get('CHUAU')).to.equal('15')
                expect(idToAreaMap.get('CHUAU-1')).to.equal('16')
                expect(idToAreaMap.get('CHUAU-5')).to.equal('20')
            })
        })
        it('getUnitToIDMap creates correct map with the correct length', () => {
            cy.wrap(getUnitToIDMap(), {timeout: 10000}).as('map')
            cy.get('@map').should((unitToIDMap) => {
                expect(unitToIDMap).to.not.be.null
                expect(unitToIDMap).to.be.a('Map')
                expect(unitToIDMap.size).to.equal(23)

                expect(unitToIDMap.get('Seeds')).to.equal('210')
                expect(unitToIDMap.get('Row Feet')).to.equal('213')
                expect(unitToIDMap.get('Flats')).to.equal('211')
                expect(unitToIDMap.get('Hours')).to.equal('219')
                expect(unitToIDMap.get('People')).to.equal('209')
            })
        })
        it('getIDToUnitMap creates correct map with the correct length', () => {
            cy.wrap(getIDToUnitMap(), {timeout: 10000}).as('map')
            cy.get('@map').should((IDToUnitMap) => {
                expect(IDToUnitMap).to.not.be.null
                expect(IDToUnitMap).to.be.a('Map')
                expect(IDToUnitMap.size).to.equal(23)

                expect(IDToUnitMap.get('210')).to.equal('Seeds')
                expect(IDToUnitMap.get('213')).to.equal('Row Feet')
                expect(IDToUnitMap.get('211')).to.equal('Flats')
                expect(IDToUnitMap.get('219')).to.equal('Hours')
                expect(IDToUnitMap.get('209')).to.equal('People')
            })
        })
    })

    context('getSessionToken API request function', () => {
        it('returns a token when it resolves', () => {
            getSessionToken().then(token => {
                expect(token).to.not.be.null
            })
        })
        it('returns a token of length 43', () => {
            getSessionToken().then(token => {
                expect(token.length).to.equal(43)
            })
        })
    })

    context('delete API request function', () => {
        it('deletes a log', () => {
            let logID = -1
            let token = null

            // Creates a new log entry & ensures it was successful.
            // Deletes the log entry using the deleteRecord function.
            // Requests the log to ensure that it has been deleted.

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
                        "name": "Delete Test",
                        "type": "farm_observation",
                        "timestamp": "123",
                    }
                }

                cy.request(req).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID = response.body.id
                })
            })
            .then(() => {
                cy.wrap(deleteRecord('/log/' + logID, token)).as('delete')
                cy.get('@delete').should((response) => {
                    expect(response.status).to.equal(200)
                })
            })
            .then(() => {
                cy.request('/log.json?type=farm_observation&id=' + logID).as('check')
                cy.get('@check').should(function(response) {
                    expect(response.body.list.length).to.equal(0)
                })
            })
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

                newLog = {
                    "name": "Create Test",
                    "type": "farm_observation",
                    "timestamp": "123",
                }

                cy.wrap(createRecord('/log', newLog, token)).as('create')
                cy.get('@create').should((response) => {
                    logID = response.data.id
                    expect(response.status).to.equal(201)
                })
            })
            .then(() => {
                cy.request('/log.json?id=' + logID).as('check')
                cy.get('@check').should((response) => {
                    expect(response.body.list.length).to.equal(1)
                })
            })
            .then(() => {
                cy.wrap(deleteRecord('/log/' + logID, token)).as('delete')
                cy.get('@delete').should(function(response) {
                    expect(response.status).to.equal(200)
                })
            })
        })
    })    

    context('update function testing', () => {
        it('change the crop of a transplanting log', () => {
            let logID = -1
            let token = null

            // Creates a new log using the createRecord function (tested above)
            // Updates the log using the updateRecord function.
            // Requests the log to ensure that it was updated
            // Deteles the log using the deleteRecord function (tested above)

            cy.wrap(getSessionToken())
            .then((sessionToken) => {
                token = sessionToken

                newLog = {
                    "name": "Update Test",
                    "type": "farm_observation",
                    "timestamp": "123",
                }

                cy.wrap(createRecord('/log', newLog, token)).as('create')
                cy.get('@create').should((response) => {
                    logID = response.data.id
                    expect(response.status).to.equal(201)
                })
            })
            .then(() => {
                update = {
                    "name": "Update Test Updated"
                }

                cy.wrap(updateRecord('/log/' + logID, update, token)).as('update')
                cy.get('@update').should((response) => {
                    expect(response.status).to.equal(200)
                })
            })
            .then(() => {
                cy.request('/log.json?id=' + logID).as('check')
                cy.get('@check').should((response) => {
                    expect(response.body.list.length).to.equal(1)
                    expect(response.body.list[0].name).to.equal("Update Test Updated")
                })
            })
            .then(() => {
                cy.wrap(deleteRecord('/log/' + logID, token)).as('delete')
                cy.get('@delete').should(function(response) {
                    expect(response.status).to.equal(200)
                })
            })
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
        
    })