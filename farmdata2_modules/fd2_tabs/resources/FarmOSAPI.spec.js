var FarmOSAPI = require("./FarmOSAPI.js")
var getAllPages = FarmOSAPI.getAllPages
var getSessionToken = FarmOSAPI.getSessionToken
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
                cy.wait('@onlyone').should(() => {
                    cy.wrap(testArray).should('have.length.gt',0)
                    calls++
                })

                getAllPages('/log?type=farm_seeding&id[lt]=1500', testArray)
            })
            .then(() => {
                expect(calls).to.equal(1)
            })
        })

        it('Test on a request with multiple pages', () => {
            cy.intercept("GET",/log\?type=farm_seeding$/).as('first')
            cy.intercept("GET","/log?type=farm_seeding&page=1").as('second')
            cy.intercept("GET","/log?type=farm_seeding&page=2").as('third')
        
            let firstCalls=0
            let secondCalls=0
            let thirdCalls=0

            cy.wait(1)
            .then(function() {
                cy.wait('@first').should(() => {
                    cy.wrap(testArray).should('have.length.gt',0)
                    firstCalls++
                })

                cy.wait('@second').should(() => {
                    // Just by getting here we know the second page was requested.

                    // Check that data made it into testArray.
                    // Note: depending on timing this may not run until after any
                    // subsequent calls.
                    cy.wrap(testArray).should('have.length.gt',100)
                    secondCalls++
                })

                cy.wait('@third').should(() => {
                    cy.wrap(testArray).should('have.length.gt',200)
                    thirdCalls++
                })

                getAllPages("/log?type=farm_seeding", testArray)

            })
            .then(() => {
                expect(firstCalls).to.equal(1)
                expect(secondCalls).to.equal(1)
                expect(thirdCalls).to.equal(1)
            })
        })
    })
    
    context('test maping functions', () => {
        it('getIDToUserMap creates correct map with the correct length', () => {
            cy.wrap(getIDToUserMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
                expect(idToNameMap).to.have.all.keys(null, '6','8','7', '4', '9', '5', '1', '3', '155')
                expect(idToNameMap.get('4')).to.equal('manager2')
                expect(idToNameMap.get('5')).to.equal('worker1')
                expect(idToNameMap.size).to.equal(10)
            })
        })

        it('getIDToCropMap creates correct map with the correct length', () => {
            cy.wrap(getIDToCropMap()).as('map').wait(200)
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
                expect(idToNameMap.get('44')).to.equal('Cauliflower')
                expect(idToNameMap.get('27')).to.equal('Mint')
                expect(idToNameMap.size).to.equal(80)
            })
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
         
        it('getUserToIDMap creates correct map with the correct length', () => {
            cy.wrap(getUserToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
                expect(idToNameMap).to.have.all.keys('Anonymous', 'guest','worker1', 'worker2', 'worker3', 'worker4', 'manager1', 'manager2', 'admin', 'restws1')
                expect(idToNameMap.get('manager2')).to.equal('4')
                expect(idToNameMap.get('worker1')).to.equal('5')
                expect(idToNameMap.size).to.equal(10)
            })
        })

        it('getCropToIDMap creates correct map with the correct length', () => {
            cy.wrap(getCropToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
                expect(idToNameMap.get('Cauliflower')).to.equal('44')
                expect(idToNameMap.get('Mint')).to.equal('27')
                expect(idToNameMap.size).to.equal(80)
            }).wait(200)
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

    context.only('createLog API request function', () => {
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
                    logID = response.data.id
                    expect(response.status).to.equal(201)
                })
                .then(function() {
                    cy.request(url + '&id=' + logID).as('checkCreated')
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