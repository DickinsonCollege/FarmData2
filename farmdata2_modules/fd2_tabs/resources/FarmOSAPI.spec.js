var FarmOSAPI = require("./FarmOSAPI.js")
var getAllPages = FarmOSAPI.getAllPages
var getSessionToken = FarmOSAPI.getSessionToken
var updateLog = FarmOSAPI.updateLog
var createLog = FarmOSAPI.createLog
var deleteLog = FarmOSAPI.deleteLog

var getIDToUserMap = FarmOSAPI.getIDToUserMap
var getIDToCropMap = FarmOSAPI.getIDToCropMap
var getIDToFieldMap = FarmOSAPI.getIDToFieldMap

var getUserToIDMap = FarmOSAPI.getUserToIDMap
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var getFieldToIDMap = FarmOSAPI.getFieldToIDMap

describe('API Request Function', () => {
    var testArray
    
    beforeEach(() => {
        cy.login('restws1', 'farmdata2')
        testArray = []
    })

    context('getAllPages API request function', () => {
        it('Test on a request with one page.', () => {
            cy.intercept("GET",/log\?type=farm_seeding/).as('onlyone')

            let calls=0

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

                cy.wait('@last', {requestTimeout: 10000}).then(() => {
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
                expect(idToNameMap.get('1')).to.equal('admin')
                expect(idToNameMap.get('6')).to.equal('manager1')
                expect(idToNameMap.get('8')).to.equal('worker1')
                expect(idToNameMap.get('13')).to.equal('guest')
                expect(idToNameMap.get('14')).to.equal('restws1')
                expect(idToNameMap.size).to.equal(11)
            })
        })
        
        it('getUserToIDMap creates correct map with the correct length', () => {
            cy.wrap(getUserToIDMap()).as('map')
            cy.get('@map').should((nameToIdMap) => {
                expect(nameToIdMap).to.not.be.null
                expect(nameToIdMap).to.be.a('Map')
                expect(nameToIdMap.get('admin')).to.equal('1')
                expect(nameToIdMap.get('manager1')).to.equal('6')
                expect(nameToIdMap.get('worker1')).to.equal('8')
                expect(nameToIdMap.get('guest')).to.equal('13')
                expect(nameToIdMap.get('restws1')).to.equal('14')
                expect(nameToIdMap.size).to.equal(11)
            })
        })

        it.only('getIDToCropMap creates correct map with the correct length', () => {
            cy.wrap(getIDToCropMap()).as('map')
            cy.get('@map').should((idToCropMap) => {
                expect(idToCropMap).to.not.be.null
                expect(idToCropMap).to.be.a('Map')

                // first and last on first page of response
                expect(idToCropMap.get('137')).to.equal('ARUGULA')
                expect(idToCropMap.get('135')).to.equal('THYME')

                // first and last on second page of response
                expect(idToCropMap.get('109')).to.equal('TOMATO')
                expect(idToCropMap.get('115')).to.equal('ZUCCHINI')
                
                expect(idToCropMap.size).to.equal(107)
            })
        })

        it.only('getCropToIDMap creates correct map with the correct length', () => {
            cy.wrap(getCropToIDMap()).as('map')
            cy.get('@map').should((cropToIdMap) => {
                expect(cropToIdMap).to.not.be.null
                expect(cropToIdMap).to.be.a('Map')
                expect(cropToIdMap.get('ARUGULA')).to.equal('137')
                expect(cropToIdMap.get('THYME')).to.equal('135')
                expect(cropToIdMap.get('TOMATO')).to.equal('109')
                expect(cropToIdMap.get('ZUCCHINI')).to.equal('115')                
                expect(cropToIdMap.size).to.equal(107)
            }).wait(200)
        })


        it('getIDToFieldMap creates correct map with the correct length', () => {
            cy.wrap(getIDToFieldMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
                expect(idToNameMap.get('100')).to.equal('O')
                expect(idToNameMap.get('127')).to.equal('SQ 6')
                expect(idToNameMap.size).to.equal(37)
            })
        })



        it('getFieldToIDMap creates correct map with the correct length', () => {
            cy.wrap(getFieldToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
                expect(idToNameMap.size).to.equal(37)
                expect(idToNameMap.get('O')).to.equal('100')
                expect(idToNameMap.get('SQ 6')).to.equal('127')
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

    context('deleteLog API request function', () => {
        it('deletes a log based on log ID', () => {
            getSessionToken()
            .then(function(token) {
                req = {
                    url: '/log.json?type=farm_observation',
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN' : token,
                    },
                    body: {
                        "name": "pleasegoaway",
                        "type": "farm_observation",
                    }
                }

                logID = -1
                cy.get(logID).as('logID')  // make logID availabe in cy scope as this.logID

                cy.request(req).as('created')
                cy.get('@created').should(function(response) {
                    expect(response.status).to.equal(201)
                    this.logID = response.body.id
                })
                .then(function() {
                    cy.wrap(deleteLog(this.logID, token))
                    .as('delete')
                    cy.get('@delete').should((response) => {
                        expect(response.status).to.equal(200)
                    })
                }) 
                .then(function() {
                    cy.request('/log.json?type=farm_observation&id=' + this.logID).as('check')
                    cy.get('@check').should(function(response) {
                        expect(response.body.list.length).to.equal(0)
                    })
                })
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

    context('update function testing', () => {
        it('change the crop of a transplanting log', () => {
            getSessionToken()
                .then(function(token) {
                    let newCrop = {name: 'Transplant Kale'}
                    
                    cy.wrap(updateLog('http://localhost/log/', '1919', newCrop, token)).as('update')
                    cy.get('@update').should(function(response) {
                        expect(response.status).to.equal(200)
                    })
                })
        })
    })

    context('createLog API request function', () => {
        it('creates a log with a passed object', () => {
            getSessionToken()
            .then(function(token) {
                logObject = {
                    "name": "yo",
                    "type": "farm_observation",
                    "timestamp": "1526584271",
                }

                url = '/log.json?type=farm_observation'
                logID = -1
                cy.get(logID).as('logID')

                cy.wrap(createLog(url, logObject, token)).as('create')
                cy.get('@create').should((response) => {
                    this.logID = response.data.id
                    expect(response.status).to.equal(201)
                })
                .then(function() {
                    cy.request(url + '&id=' + this.logID).as('checkCreated')
                    cy.get('@checkCreated').should((response) => {
                        expect(response.body.list.length).to.equal(1)
                    })
                })
                .then(function() {
                    cy.wrap(deleteLog(this.logID, token)).as('delete')
                    cy.get('@delete').should(function(response) {
                        expect(response.status).to.equal(200)
                    })
                }) 
            })
        })
    })    
})