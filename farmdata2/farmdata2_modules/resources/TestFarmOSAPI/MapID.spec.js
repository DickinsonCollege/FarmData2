var FarmOSAPI = require("../FarmOSAPI.js")
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
describe("API request for ID mapping funtion", () => {
    beforeEach(() => {
        // Login as restws1, which is a user that can make api requests.
        cy.login('restws1', 'farmdata2')
    })
    context('test maping functions', () => {
        it('User map functions get the proper name/id for the users', () => {
            let manager1ID = -1
            let adminID = -1
            let worker2ID = -1
            let guestID = -1
            let restws1ID = -1

            cy.wrap(getUserToIDMap()).as('nameMap')
            cy.get('@nameMap').should(function (nameToIdMap) {
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
                    cy.get('@idMap').should(function (idToNameMap) {
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
            cy.get('@areaMap').should(function (areaToIDMap) {
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
                    cy.get('@idMap').should(function (idToAreaMap) {
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

        it('Unit map functions get the proper name/id for the units', () => {
            let seedsID = -1
            let rowFeetID = -1
            let flatsID = -1
            let hoursID = -1
            let peopleID = -1

            cy.wrap(getUnitToIDMap()).as('unitMap')
            cy.get('@unitMap').should(function (unitToIDMap) {
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
                    cy.get('@idMap').should(function (idToUnitMap) {
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
            cy.get('@logMap').should(function (logTypeToIDMap) {
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
                    cy.get('@idMap').should(function (idToLogTypeMap) {
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

})
