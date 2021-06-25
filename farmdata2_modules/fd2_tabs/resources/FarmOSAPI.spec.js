var FarmOSAPI = require("./FarmOSAPI.js")
var getAllPages = FarmOSAPI.getAllPages
var getSessionToken = FarmOSAPI.getSessionToken
var deleteLog = FarmOSAPI.deleteLog
var createLog = FarmOSAPI.createLog

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
                    cy.wrap(testArray).should('have.length.gt',100)
                    secondCalls++
                })

                cy.wait('@third').should(() => {
                    cy.wrap(testArray).should('have.length.gt',200)
                    thirdCalls++
                })

                cy.wrap(getAllPages("/log?type=farm_seeding", testArray)).as('all')
                cy.get('@all').should(() => {
                    expect(firstCalls).to.equal(1)
                    expect(secondCalls).to.equal(1)
                    expect(thirdCalls).to.equal(1)
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

    context('createLog API request function', () => {
        it('creates a log with a passed object', () => {
            getSessionToken()
                .then(function(token) {
                    console.log(token)
                    console.log('making log')

                    logObject = {
                        "name": "testname",
                        "type": "farm_observation",
                        "timestamp": "1526584271",
                    }

                    url = '/log.json?type=farm_observation'
                    logID = -1
                    cy.get(logID).as('logID')

                    cy.wrap(createLog(url, logObject, token)).as('create')
                    cy.get('@create').should(function(response) {
                        this.logID = response.data.id
                        console.log(this.logID)
                        expect(response.status).to.equal(201)
                    })
                    .then(function() {
                        console.log(this.logID)
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

    context('deleteLog API request function', () => {
        it('deletes a log based on log ID', () => {
            getSessionToken()
            .then(function(token) {
                console.log(token)
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

                cLogID = -1
                cy.get(cLogID).as('cLogID')  // make logID availabe in cy scope as this.logID

                cy.request(req).as('created2')
                cy.get('@created2').should(function(response) {
                    expect(response.status).to.equal(201)
                    this.cLogID = response.body.id
                })
                .then(function() {
                    cy.wrap(deleteLog(this.cLogID, token))
                    .as('delete2')
                    cy.get('@delete2').should((response) => {
                        expect(response.status).to.equal(200)
                    })
                }) 
                .then(function() {
                    cy.request('/log.json?type=farm_observation&id=' + this.cLogID).as('check2')
                    cy.get('@check2').should(function(response) {
                        expect(response.body.list.length).to.equal(0)
                    })
                })
            })
        })
    })
})