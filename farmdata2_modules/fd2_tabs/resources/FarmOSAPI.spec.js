var FarmOSAPI = require("./FarmOSAPI.js")
var getAllPages = FarmOSAPI.getAllPages

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
    context('api request test', () => {
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
            .then(() => {
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
    
    context('test maping id to name functions', () => {
        it('getIDToUserMap function returns a map', () => {
            cy.wrap(getIDToUserMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
            })
        })
        it('getIDToUserMap returns correct keys', () => {
            cy.wrap(getIDToUserMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.have.all.keys(null, '6','8','7', '4', '9', '5', '1', '3', '155')
            })
        })
        it('getIDToUserMap correct maps key to value', () => {
            cy.wrap(getIDToUserMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap.get(null)).to.equal('Anonymous')
                expect(idToNameMap.get('5')).to.equal('worker1')
            })
        })
        it('getIDToCropMap function returns a map', () => {
            cy.wrap(getIDToCropMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
            }).wait(200)
        })
        it('getIDToCropMap correct maps key to value', () => {
            cy.wrap(getIDToCropMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap.get('117')).to.equal('Cilantro')
                expect(idToNameMap.get('153')).to.equal('Escarole')
            })
        })
        it('getIDToCropMap to produce a map of length 79', () => {
            cy.wrap(getIDToCropMap()).as('map')
            cy.get('@map').should((idToNameMap) => { 
                expect(idToNameMap.size).to.equal(79)
            })
        })
        it('getIDToFieldMap function returns a map', () => {
            cy.wrap(getIDToFieldMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
            })
        })
        it('getIDToFieldMap correct maps key to value', () => {
            cy.wrap(getIDToFieldMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap.size).to.equal(37)
            })
        })
        it('getIDToFieldMap correct maps key to value', () => {
            cy.wrap(getIDToFieldMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap.get('100')).to.equal('O')
                expect(idToNameMap.get('127')).to.equal('SQ 6')
            })
        })
    })

    context('test maping name to id functions', () => {
        it('getUserToIDMap function returns a map', () => {
            cy.wrap(getUserToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
            })
        })
        it('getUserToIDMap returns correct keys', () => {
            cy.wrap(getUserToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.have.all.keys('Anonymous', 'guest','worker1', 'worker2', 'worker3', 'worker4', 'manager1', 'manager2', 'admin', 'restws1')
            })
        })
        it('getUserToIDMap returns map with length 10', () => {
            cy.wrap(getUserToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap.size).to.equal(10)
            })
        })
        it('getUserToIDMap correct maps key to value', () => {
            cy.wrap(getUserToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap.get('Anonymous')).to.equal(null)
                expect(idToNameMap.get('worker1')).to.equal('5')
            })
        })
        it('getCropToIDMap function returns a map', () => {
            cy.wrap(getCropToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
            })
        })
        it('getCropToIDMap correct maps key to value', () => {
            cy.wrap(getCropToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap.get('Cilantro')).to.equal('117')
                expect(idToNameMap.get('Escarole')).to.equal('153')
            })
        })
        it('getCropToIDMap to produce a map of length 77', () => {
            cy.wrap(getCropToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => { 
                expect(idToNameMap.size).to.equal(77)
            })
        })
        it('getFieldToIDMap function returns a map', () => {
            cy.wrap(getFieldToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap).to.not.be.null
                expect(idToNameMap).to.be.a('Map')
            })
        })
        it('getFieldToIDMap to produce a map of length 37', () => {
            cy.wrap(getFieldToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap.size).to.equal(37)
            })
        })
        it('getFieldToIDMap correct maps key to value', () => {
            cy.wrap(getFieldToIDMap()).as('map')
            cy.get('@map').should((idToNameMap) => {
                expect(idToNameMap.get('O')).to.equal('100')
                expect(idToNameMap.get('SQ 6')).to.equal('127')
            })
        })
    })
})