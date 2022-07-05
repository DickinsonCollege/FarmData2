const dayjs = require('dayjs')

var FarmOSAPI = require('../resources/FarmOSAPI.js')

var createRecord = FarmOSAPI.createRecord
var updateRecord = FarmOSAPI.updateRecord
var deleteRecord = FarmOSAPI.deleteRecord
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var getAreaToIDMap = FarmOSAPI.getAreaToIDMap
var getUserToIDMap = FarmOSAPI.getUserToIDMap
var getUnitToIDMap = FarmOSAPI.getUnitToIDMap
var getRecord = FarmOSAPI.getRecord
var getSessionToken = FarmOSAPI.getSessionToken
var getLogTypeToIDMap = FarmOSAPI.getLogTypeToIDMap
var getAllPages = FarmOSAPI.getAllPages

describe('Test the seeding input page', () => {
    
    let sessionToken = null
    let cropToIDMap = null
    let areaToIDMap = null
    let userToIDMap = null
    let unitToIDMap = null
    let logTypeToIDMap = null
    
    context('Cache tests', () => {
        before(() => {
            // Delete the crops and areas from local storge if it is there
            // before running our tests.  
            localStorage.removeItem('crops')
            localStorage.removeItem('areas')
        })
        
        beforeEach(() => {
            cy.login('manager1', 'farmdata2')
            
            // Cypress clears the local storage between each test.  
            // So we need to save it at the end of each test (see afterEach)
            // and then restore beore each test (here). 
            cy.restoreLocalStorage() 
            cy.visit('/farm/fd2-field-kit/seedingInput')
        }) 
        
        afterEach(() => {
            // Save the local storage at the end of each test so 
            // that it can be restored at the start of the next 
            cy.saveLocalStorage()
        })
        
        it('test the first visit to the page (i.e. no cached crops and areas)', () => {
            // This needs to be the first test run to work properly.
            // First time through the crops and areas should not be cached.
            // Note the cached value is cleared in the before().
            let crops = localStorage.getItem('crops')
            let areas = localStorage.getItem('areas')

            expect(crops).to.equal(null)
            expect(areas).to.equal(null)

            // Set up intercepts to wait for the map to be loaded for caching. 
            cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap') 
            // Wait here for the maps to load in the page. 
            cy.wait(['@cropmap', '@areamap']) 
        })

        it('test a second visit to the page (i.e. with cached crops and areas)', () => {
            // Second time through the crops and areas should be cached.
            let crops = localStorage.getItem('crops')
            let areas = localStorage.getItem('areas')

            // The maps are cached in the localStorage.
            // No longer needed to wait for the API Call to complete.
            expect(crops).to.not.equal(null)
            expect(areas).to.not.equal(null)

        })
    })

    context('Initial area and crops API call tests', () => {
    // API calls to User, Unit, SessionToken, LogType will be tested in log creation/deletion.
        beforeEach(() => {
            cy.login('manager1', 'farmdata2')
            .then(() => {
                // Using wrap to wait for the asynchronus API request.
                    cy.wrap(getCropToIDMap()).as('cropMap')
                    cy.wrap(getAreaToIDMap()).as('areaMap')

            })
            // Wait here for the maps in the tests.
            cy.get('@cropMap').should(function(map) {
                cropToIDMap = map
            })
            cy.get('@areaMap').should(function(map) {
                areaToIDMap = map
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap') 
            
            cy.restoreLocalStorage()
            cy.visit('/farm/fd2-field-kit/seedingInput')

            // Wait here for the maps to load in the page.
            
            cy.wait(['@cropmap', '@areamap','@cropmap', '@areamap'])
        })

        afterEach(() => {
            // Save the local storage at the end of each test so 
            // that it can be restored at the start of the next 
            cy.saveLocalStorage()
        })

        it('test if crops are correctly loaded to the dropdown', () => {

            cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'ARUGULA')
            cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                .children() 
                .last()  
                .should('have.value', 'ZUCCHINI')
            cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', cropToIDMap.size)
        })

        it('test if areas are correctly loaded to the dropdown for tray seeding', () => {
            // Applying the filter to the area dropdown for tray seeding
            let areaArray = []
            let areaResponse = JSON.parse(localStorage.getItem('areas'))
            let trayAreaOnly = areaResponse.filter((x) => x.area_type === 'greenhouse')
            areaArray = trayAreaOnly.map((h) => h.name)

            cy.get('[data-cy=tray-seedings]')
                .click()
                .then(() => {
                    cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                        .children() 
                        .first()
                        .should('have.value', 'CHUAU')
                    cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                        .children() 
                        .last()  
                        .should('have.value', 'SEEDING BENCH')
                    cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                        .children() 
                        .should('have.length', areaArray.length)
                })
        })

        it('test if areas are correctly loaded to the dropdown for direct seeding', () => {
            // Applying the filter to the area dropdown for direct seeding
            let areaArray = []
            let areaResponse = JSON.parse(localStorage.getItem('areas'))
            let directAreaOnly = areaResponse.filter((x) => x.area_type === 'field' || x.area_type === 'bed')
            areaArray = directAreaOnly.map((h) => h.name)

            cy.get('[data-cy=direct-seedings]')
                .click()
                .then(() => {
                    cy.get('[data-cy=direct-area-selection] > [data-cy=dropdown-input]')
                        .children() 
                        .first()
                        .should('have.value', 'A')
                    cy.get('[data-cy=direct-area-selection] > [data-cy=dropdown-input]')
                        .children() 
                        .last()  
                        .should('have.value', 'Z')
                    cy.get('[data-cy=direct-area-selection] > [data-cy=dropdown-input]')
                        .children() 
                        .should('have.length', areaArray.length)
                })
        })        
    })
    
    
    context('Non-API related dropdown tests', () => {
        before(() => {
            cy.login('manager1', 'farmdata2')
            cy.visit('/farm/fd2-field-kit/seedingInput')
            .then(() => {
                // Using wrap to wait for the asynchronus API request.
                    cy.wrap(getCropToIDMap()).as('cropMap')
                    cy.wrap(getAreaToIDMap()).as('areaMap')

            })
            // Wait here for the maps in the tests.
            cy.get('@cropMap').should(function(map) {
                cropToIDMap = map
            })
            cy.get('@areaMap').should(function(map) {
                areaToIDMap = map
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap') 
        })
        beforeEach(() => {
            cy.restoreLocalStorage()
        })
        
        afterEach(() => { 
            cy.saveLocalStorage()
        })

        it('feet unit dropdown test', () => {
            cy.get('[data-cy=direct-seedings]')
                .click()
                .then(() => {
                    cy.get('[data-cy=unit-feet] > [data-cy=dropdown-input]')
                        .children() 
                        .first()
                        .should('have.value', 'Bed Feet')
                    cy.get('[data-cy=unit-feet] > [data-cy=dropdown-input]')
                        .children() 
                        .last()  
                        .should('have.value', 'Row Feet')
                    cy.get('[data-cy=unit-feet] > [data-cy=dropdown-input]')
                        .children() 
                        .should('have.length', 2)
                })
        })

        
        it('time unit dropdown test', () => {
            cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'minutes')
            cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                .children() 
                .last()
                .should('have.value', 'hours')
            cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', 2)
        })

        it('test if time unit dropdown displays correct input field', () => {
            // when minute is selected, hour input should not be visible
            cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                .select("minutes")
                .then(() => {
                    cy.get('[data-cy=minute-input]')
                        .should('be.visible')
                    cy.get('[data-cy=hour-input]')
                        .should('not.be.visible')
                })
            // when hour is selected, minute input should not be visible
            cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                .select("hours")
                .then(() => {
                    cy.get('[data-cy=minute-input]')
                        .should('not.be.visible')
                    cy.get('[data-cy=hour-input]')
                        .should('be.visible')
                })    
        })
    })    
    
    context('Tray/Direct seeding type switch test', () => {
        beforeEach(() => {
            cy.login('manager1', 'farmdata2')
            cy.visit('/farm/fd2-field-kit/seedingInput')
            .then(() => {
                // Using wrap to wait for the asynchronus API request.
                    cy.wrap(getCropToIDMap()).as('cropMap')
                    cy.wrap(getAreaToIDMap()).as('areaMap')

            })
            // Wait here for the maps in the tests.
            cy.get('@cropMap').should(function(map) {
                cropToIDMap = map
            })
            cy.get('@areaMap').should(function(map) {
                areaToIDMap = map
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap') 
        })
        

        it('check if correct fields are displayed when tray seeding is selected', () => {
            cy.get('[data-cy=tray-seedings]')
                .click()
            cy.get('[data-cy=tray-area-selection]')
                .should('be.visible')
            cy.get('[data-cy=num-cell-input]')
                .should('be.visible')
            cy.get('[data-cy=num-tray-input]')
                .should('be.visible')
            cy.get('[data-cy=num-seed-input]')
                .should('be.visible')

            cy.get('[data-cy=direct-area-selection]')
                .should('not.be.visible')
            cy.get('[data-cy=num-rowbed-input]')
                .should('not.be.visible')
            cy.get('[data-cy=num-feet-input]')
                .should('not.be.visible')
        })

        it('check if correct fields are displayed when direct seeding is selected', () => {
            cy.get('[data-cy=direct-seedings]')
                .click()
            cy.get('[data-cy=direct-area-selection]')
                .should('be.visible')
            cy.get('[data-cy=num-rowbed-input]')
                .should('be.visible')
            cy.get('[data-cy=num-feet-input]')
                .should('be.visible')

            cy.get('[data-cy=tray-area-selection]')
                .should('not.be.visible')
            cy.get('[data-cy=num-cell-input]')
                .should('not.be.visible')
            cy.get('[data-cy=num-tray-input]')
                .should('not.be.visible')
            cy.get('[data-cy=num-seed-input]')
                .should('not.be.visible')

        })

    })    

    context('Regex input test', () => {
        before(() => {
            cy.login('manager1', 'farmdata2')
            cy.visit('/farm/fd2-field-kit/seedingInput')
            .then(() => {
                // Using wrap to wait for the asynchronus API request.
                    cy.wrap(getCropToIDMap()).as('cropMap')
                    cy.wrap(getAreaToIDMap()).as('areaMap')

            })
            // Wait here for the maps in the tests.
            cy.get('@cropMap').should(function(map) {
                cropToIDMap = map
            })
            cy.get('@areaMap').should(function(map) {
                areaToIDMap = map
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap') 
        })
        
        context('Tray Seeding input test', () => {
            beforeEach(() => {
                cy.restoreLocalStorage()
                cy.get('[data-cy=tray-seedings]')
                    .click()
            })

            afterEach(() => {
                // Save the local storage at the end of each test so 
                // that it can be restored at the start of the next 
                cy.saveLocalStorage()
            })

            it('valid Cells/Tray input test', () => {
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .clear()
                    .type('5')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 255, 255)')
            })

            it('invalid Cells/Tray input test', () => {
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .clear()
                    .type('asdf')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .clear()
                    .type('-5')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')

                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .clear()
                    .type('3.343')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    
            })

            it('valid Tray input test', () => {
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .clear()
                    .type('3')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 255, 255)')
            })

            it('invalid Tray input test', () => {
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .clear()
                    .type('asdf')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .clear()
                    .type('-5')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')

                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .clear()
                    .type('3.343')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
            })

            it('valid Seed input test', () => {
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .clear()
                    .type('3')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 255, 255)')
            })

            it('invalid Seed input test', () => {
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .clear()
                    .type('asdf')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .clear()
                    .type('-5')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .clear()
                    .type('3.343')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
            })
        })

        context('Direct Seeding input test', () => {
            beforeEach(() => {
                cy.restoreLocalStorage()
                cy.get('[data-cy=direct-seedings]')
                    .click()
            })

            afterEach(() => { 
                cy.saveLocalStorage()
            })

            it('valid Row/Bed input test', () => {
                cy.get('[data-cy=num-rowbed-input] > [data-cy=text-input]')
                    .clear()
                    .type('5')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 255, 255)')
            })

            it('invalid Row/Bed input test', () => {
                cy.get('[data-cy=num-rowbed-input] > [data-cy=text-input]')
                    .clear()
                    .type('asdf')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    
                cy.get('[data-cy=num-rowbed-input] > [data-cy=text-input]')
                    .clear()
                    .type('-5')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    

                cy.get('[data-cy=num-rowbed-input] > [data-cy=text-input]')
                    .clear()
                    .type('3.343')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    
            })

            it('valid Feet input test', () => {
                cy.get('[data-cy=num-feet-input] > [data-cy=text-input]')
                    .clear()
                    .type('3')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 255, 255)')
            })

            it('invalid Feet input test', () => {
                cy.get('[data-cy=num-feet-input] > [data-cy=text-input]')
                    .clear()
                    .type('asdf')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    
                cy.get('[data-cy=num-feet-input] > [data-cy=text-input]')
                    .clear()
                    .type('-5')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')

                cy.get('[data-cy=num-feet-input] > [data-cy=text-input]')
                    .clear()
                    .type('3.343')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
            })
        })

        context('Labor input test', () => {
           
            beforeEach(() => {
                cy.restoreLocalStorage()
            })
            
            afterEach(() => { 
                cy.saveLocalStorage()
            })

            it('valid Worker input test', () => {
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .clear()
                    .type('3')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 255, 255)')
            })

            it('invalid Worker input test', () => {
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .clear()
                    .type('asdf')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .clear()
                    .type('-5')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
                    

                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .clear()
                    .type('3.343')
                    .blur()
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 192, 203)')
            })

            it('valid Minute input test', () => {
                cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                    .select('minutes')
                    .then(() => {
                        cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                            .clear()
                            .type('5')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 255, 255)')
                    })
            })

            it('invalid Minute input test', () => {
                cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                    .select('minutes')
                    .then(() => {
                        cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                            .clear()
                            .type('asdf')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 192, 203)')
        
                        cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                            .clear()
                            .type('-5')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 192, 203)')
        
                        cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                            .clear()       
                            .type('3.343')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 192, 203)') 
                    })
            })

            it('valid Hour input test', () => {
                cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                    .select('hours')
                    .then(() => {
                        cy.get('[data-cy=hour-input] > [data-cy=text-input]')
                            .clear()
                            .type('3')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 255, 255)')
                        
                        cy.get('[data-cy=hour-input] > [data-cy=text-input]')
                        .clear()
                            .type('3.33')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 255, 255)')
                            
                            cy.get('[data-cy=hour-input] > [data-cy=text-input]')
                            .clear()
                            .type('.33')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 255, 255)')
                            
                            cy.get('[data-cy=hour-input] > [data-cy=text-input]')
                            .clear()
                            .type('0.3')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 255, 255)')
                    })
            })

            it('invalid Hour input test', () => {
                cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                    .select('hours')
                    .then(() => {
                        cy.get('[data-cy=hour-input] > [data-cy=text-input]')
                            .clear()
                            .type('asdf')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 192, 203)')
                            
                        cy.get('[data-cy=hour-input] > [data-cy=text-input]')
                            .clear()
                            .type('-5')
                            .blur()
                            .should('have.css', 'background-color')
                            .and('eq', 'rgb(255, 192, 203)')
                            
                        cy.get('[data-cy=hour-input] > [data-cy=text-input]')
                        .clear()
                        .type('3.343')
                        .blur()
                        .should('have.css', 'background-color')
                        .and('eq', 'rgb(255, 192, 203)')
                    })
            })
        })
    })

    context('workflow test', () => {
        context('workflow after submit is clicked', () => {
            beforeEach(() => {
                cy.login('manager1', 'farmdata2')
                .then(() => {
                    // Using wrap to wait for the asynchronus API request.
                    cy.wrap(getSessionToken()).as('token')
                    cy.wrap(getCropToIDMap()).as('cropMap')
                    cy.wrap(getAreaToIDMap()).as('areaMap')
                    cy.wrap(getUserToIDMap()).as('userMap')
                    cy.wrap(getUnitToIDMap()).as('unitMap')
                    cy.wrap(getLogTypeToIDMap()).as('logTypeMap')
                })
    
                // Waiting for the session token and maps to load.
                cy.get('@token').should(function(token) {
                    sessionToken = token
                })
                cy.get('@cropMap').should(function(map) {
                    cropToIDMap = map
                })
                cy.get('@areaMap').should(function(map) {
                    areaToIDMap = map
                })
                cy.get('@userMap').should(function(map) {
                    userToIDMap = map
                })
                cy.get('@unitMap').should(function(map) {
                        unitToIDMap = map
                })        
                cy.get('@logTypeMap').should(function(map) {
                    logTypeToIDMap = map
                })
                    
                // Setting up wait for the request in the created() to complete.
                cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
                cy.intercept('GET', 'restws/session/token').as('sessiontok')
                cy.intercept('GET', 'user').as('usermap')
                cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap')        
                cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitmap')
                cy.intercept('GET', 'taxonomy_term.json?bundle=farm_log_categories').as('logtypemap')
    
                cy.visit('/farm/fd2-field-kit/seedingInput')
                cy.restoreLocalStorage()    
                // Wait here for the map and token to be loaded in the page 
                cy.wait(['@cropmap', '@areamap', '@sessiontok', '@cropmap', '@usermap', '@areamap', '@unitmap', '@logtypemap'])
    
                // initialize with valid default input values. Date should be today's date by default.
                cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                    .select("ARUGULA")
                cy.get('[data-cy=tray-seedings]')
                    .click()
                cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                    .select("CHUAU")
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                    .type('1')
                    .blur()
            })
                
            it('disabled input test (when form is submitted, all inputs are disabled)', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                    .click()
                    .then(() => {
                        cy.get('[data-cy=date-selection] > [data-cy=date-select]')
                            .should('be.disabled')
                        cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                            .should('be.disabled')
                        cy.get('[data-cy=tray-seedings]')
                            .should('be.disabled')
                        cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                            .should('be.disabled')
                        cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                            .should('be.disabled')
                        cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                            .should('be.disabled')
                        cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                            .should('be.disabled')
                        cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                            .should('be.disabled')
                        cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                            .should('be.disabled')
                        cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                            .should('be.disabled')
                    })
            })

            it('button tests (after submit is clicked, confirm and cancel should be visible and submit should be disabled)', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                    .click()
                    .then(() => {
                        cy.get('[data-cy=submit-button]')
                            .should('be.disabled')
                        cy.get('[data-cy=confirm-button]')
                            .should('not.be.disabled')
                        cy.get('[data-cy=cancel-button]')
                            .should('not.be.disabled')
                    })
            })

            it('cancel test (alert message and maintain inputs)', () => {
                cy.get('[data-cy=submit-button]')
                    .click()
                cy.get('[data-cy=cancel-button]')
                    .click()
                cy.get('[data-cy=alert-cancel')     // need to add scroll up test here after added
                    .should('be.visible')
                    .wait(3000)
                    .should('not.be.visible')
                cy.get('[data-cy=alert-success')
                    .should('not.be.visible')
                cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                    .should('have.value', 'ARUGULA')
                cy.get('[data-cy=tray-seedings]')
                    .should('be.checked')
                cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                    .should('have.value','CHUAU')
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .should('have.value', '1')
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .should('have.value','1')
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .should('have.value', '1')
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .should('have.value', '1')
                cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                    .should('have.value', '1')
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
            })

            it('confirm test (alert message and reset inputs)', () => {
                cy.get('[data-cy=submit-button]')
                    .click()
                cy.get('[data-cy=confirm-button]')
                    .click()
                cy.get('[data-cy=alert-cancel')
                    .should('not.be.visible')
                cy.get('[data-cy=alert-success')    // need to add scroll up test here after added
                    .should('be.visible')
                    .wait(3000)
                    .should('not.be.visible')
                cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                    .should('not.have.value', 'ARUGULA')
                cy.get('[data-cy=tray-seedings]')
                    .should('not.be.checked')
                cy.get('[data-cy=direct-seedings]')
                    .should('not.be.checked')
                cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                    .should('not.have.value','CHUAU')
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .should('not.have.value', '1')
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .should('not.have.value','1')
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .should('not.have.value', '1')
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .should('not.have.value', '1')
                cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                    .should('not.have.value', '1')
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
            })
        })

        context('invalid API dropdown submit button test (submit button should be disbled when there is an invalid input)', () => {
            beforeEach(() => {
                cy.login('manager1', 'farmdata2')
                .then(() => {
                    // Using wrap to wait for the asynchronus API request.
                    cy.wrap(getSessionToken()).as('token')
                    cy.wrap(getCropToIDMap()).as('cropMap')
                    cy.wrap(getAreaToIDMap()).as('areaMap')
                    cy.wrap(getUserToIDMap()).as('userMap')
                    cy.wrap(getUnitToIDMap()).as('unitMap')
                    cy.wrap(getLogTypeToIDMap()).as('logTypeMap')
                })
    
                // Waiting for the session token and maps to load.
                cy.get('@token').should(function(token) {
                    sessionToken = token
                })
                cy.get('@cropMap').should(function(map) {
                    cropToIDMap = map
                })
                cy.get('@areaMap').should(function(map) {
                    areaToIDMap = map
                })
                cy.get('@userMap').should(function(map) {
                    userToIDMap = map
                })
                cy.get('@unitMap').should(function(map) {
                        unitToIDMap = map
                })        
                cy.get('@logTypeMap').should(function(map) {
                    logTypeToIDMap = map
                })
                    
                // Setting up wait for the request in the created() to complete.
                cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
                cy.intercept('GET', 'restws/session/token').as('sessiontok')
                cy.intercept('GET', 'user').as('usermap')
                cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap')        
                cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitmap')
                cy.intercept('GET', 'taxonomy_term.json?bundle=farm_log_categories').as('logtypemap')
    
                cy.visit('/farm/fd2-field-kit/seedingInput')
                    
                // Wait here for the map and token to be loaded in the page 
                cy.wait(['@cropmap', '@areamap', '@sessiontok', '@cropmap', '@usermap', '@areamap', '@unitmap', '@logtypemap'])
    
                // initialize with valid default input values. Date should be today's date by default.
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                .type('1')
                cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                .type('1')
                .blur()
            })

            it('invalid Crop dropdown' , () => {
                cy.get('[data-cy=tray-seedings]')
                    .click()
                cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                    .select("CHUAU")
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                    .select("ARUGULA")
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')           
            })

            it('invalid Tray area dropdown' , () => {
                cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                    .select("ARUGULA")
                cy.get('[data-cy=tray-seedings]')
                    .click()
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                    .select("CHUAU")
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')           
            })

            it('invalid Direct area dropdown' , () => {
                cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                    .select("ARUGULA")
                cy.get('[data-cy=direct-seedings]')
                    .click()
                cy.get('[data-cy=num-rowbed-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-feet-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=direct-area-selection] > [data-cy=dropdown-input]')
                    .select("A")
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')           
            })
            
            it('all invalid inputs test', () => {
                cy.get('[data-cy=tray-seedings]')
                    .click()
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .type('1.2222')
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .type('1.2222')
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .type('1.2222')
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .type('1.22221')
                cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                    .type('1.2222')
                    .blur()
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled') 
                cy.get('[data-cy=direct-seedings]')
                    .click()
                cy.get('[data-cy=num-feet-input] > [data-cy=text-input]')
                    .type('1.4536356')
                    .blur()    
                cy.get('[data-cy=num-rowbed-input] > [data-cy=text-input]')
                    .type('2.232323')
                    .blur()
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled') 
            })
        
        
        })

        context('invalid non-API inputs submit button test (submit button should be disbled when there is an invalid input)', () => {
            before(() => {
                cy.login('manager1', 'farmdata2')
                .then(() => {
                    // Using wrap to wait for the asynchronus API request.
                    cy.wrap(getSessionToken()).as('token')
                    cy.wrap(getCropToIDMap()).as('cropMap')
                    cy.wrap(getAreaToIDMap()).as('areaMap')
                    cy.wrap(getUserToIDMap()).as('userMap')
                    cy.wrap(getUnitToIDMap()).as('unitMap')
                    cy.wrap(getLogTypeToIDMap()).as('logTypeMap')
                })
    
                // Waiting for the session token and maps to load.
                cy.get('@token').should(function(token) {
                    sessionToken = token
                })
                cy.get('@cropMap').should(function(map) {
                    cropToIDMap = map
                })
                cy.get('@areaMap').should(function(map) {
                    areaToIDMap = map
                })
                cy.get('@userMap').should(function(map) {
                    userToIDMap = map
                })
                cy.get('@unitMap').should(function(map) {
                        unitToIDMap = map
                })        
                cy.get('@logTypeMap').should(function(map) {
                    logTypeToIDMap = map
                })
                    
                // Setting up wait for the request in the created() to complete.
                cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
                cy.intercept('GET', 'restws/session/token').as('sessiontok')
                cy.intercept('GET', 'user').as('usermap')
                cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap')        
                cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitmap')
                cy.intercept('GET', 'taxonomy_term.json?bundle=farm_log_categories').as('logtypemap')
    
                cy.visit('/farm/fd2-field-kit/seedingInput')
                    
                // Wait here for the map and token to be loaded in the page 
                cy.wait(['@cropmap', '@areamap', '@sessiontok', '@cropmap', '@usermap', '@areamap', '@unitmap', '@logtypemap'])
    
                // initialize with valid default input values. Date should be today's date by default.
                cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
                    .select("ARUGULA")
                cy.get('[data-cy=tray-seedings]')
                    .click()
                cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
                    .select("CHUAU")
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .type('1')
                cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                    .type('1')
                    .blur()
            })

            it('invalid Cell/Tray input test', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .clear()
                    .type('2.232323')
                    .blur()
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
                    .clear()
                    .type('1')
                    .blur()
            })

            it('invalid Tray input test', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .clear()
                    .type('2.232323')
                    .blur()
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
                    .clear()
                    .type('1')
                    .blur()
            })

            it('invalid Seed input test', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .clear()
                    .type('2.232323')
                    .blur()
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
                    .clear()
                    .type('1')
                    .blur()
            })

            it('invalid Rowbed input test', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                cy.get('[data-cy=direct-seedings]')
                    .click()
                cy.get('[data-cy=direct-area-selection] > [data-cy=dropdown-input]')
                    .select("A")
                cy.get('[data-cy=num-feet-input] > [data-cy=text-input]')
                    .type('1')
                    .blur()    
                cy.get('[data-cy=num-rowbed-input] > [data-cy=text-input]')
                    .type('2.232323')
                    .blur()
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=num-rowbed-input] > [data-cy=text-input]')
                    .clear()
                    .type('1')
                    .blur()
            })

            it('invalid Feet input test', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                cy.get('[data-cy=num-feet-input] > [data-cy=text-input]')
                    .type('2.232323')
                    .blur()
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=num-feet-input] > [data-cy=text-input]')
                    .clear()
                    .type('1')
                    .blur()
            })

            it('invalid minute test', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                    .clear()
                    .type('2.232323')
                    .blur()
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=minute-input] > [data-cy=text-input]')
                    .clear()
                    .type('1')
                    .blur()
            })
            
            it('invalid worker test', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .clear()
                    .type('2.232323')
                    .blur()
                cy.get('[data-cy=submit-button]')
                    .should('be.disabled')
                cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
                    .clear()
                    .type('1')
                    .blur()
            })

            it('invalid hour test', () => {
                cy.get('[data-cy=submit-button]')
                    .should('not.be.disabled')
                cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                    .select('hours')
                    .then(() => {
                        cy.get('[data-cy=hour-input] > [data-cy=text-input]')
                            .clear()
                            .type('2.232323')
                            .blur()
                        cy.get('[data-cy=submit-button]')
                            .should('be.disabled')
                        cy.get('[data-cy=hour-input] > [data-cy=text-input]')
                            .clear()
                    })
                cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                .select('minutes')    
            })
        })
        
    })

    context('Log Creation tests', () => {
        let seedingLog = []
        let plantingAsset = []
        beforeEach(() => {
            seedingLog = []
            plantingAsset = []
            cy.login('manager1', 'farmdata2')
            .then(() => {
                // Using wrap to wait for the asynchronus API request.
                cy.wrap(getSessionToken()).as('token')
                cy.wrap(getCropToIDMap()).as('cropMap')
                cy.wrap(getAreaToIDMap()).as('areaMap')
                cy.wrap(getUserToIDMap()).as('userMap')
                cy.wrap(getUnitToIDMap()).as('unitMap')
                cy.wrap(getLogTypeToIDMap()).as('logTypeMap')
            })
            
            // Waiting for the session token and maps to load.
            cy.get('@token').should(function(token) {
                sessionToken = token
            })
            cy.get('@cropMap').should(function(map) {
                cropToIDMap = map
            })
            cy.get('@areaMap').should(function(map) {
                areaToIDMap = map
            })
            cy.get('@userMap').should(function(map) {
                userToIDMap = map
            })
            cy.get('@unitMap').should(function(map) {
                unitToIDMap = map
            })        
            cy.get('@logTypeMap').should(function(map) {
                logTypeToIDMap = map
            })
            
            // Setting up wait for the request in the created() to complete.
            cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
            cy.intercept('GET', 'restws/session/token').as('sessiontok')
            cy.intercept('GET', 'user').as('usermap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap')        
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitmap')
            cy.intercept('GET', 'taxonomy_term.json?bundle=farm_log_categories').as('logtypemap')
            
            cy.visit('/farm/fd2-field-kit/seedingInput')
            
            // Wait here for the map and token to be loaded in the page 
            cy.wait(['@cropmap', '@areamap', '@sessiontok', '@cropmap', '@usermap', '@areamap', '@unitmap', '@logtypemap'])
            
            cy.get('[data-cy=date-select')
            .type('1999-10-06')
            cy.get('[data-cy=crop-selection] > [data-cy=dropdown-input]')
            .select("ARUGULA")
            cy.get('[data-cy=tray-seedings]')
            .click()
            cy.get('[data-cy=tray-area-selection] > [data-cy=dropdown-input]')
            .select("CHUAU")
            cy.get('[data-cy=num-cell-input] > [data-cy=text-input]')
            .type('2')
            cy.get('[data-cy=num-tray-input] > [data-cy=text-input]')
            .type('2')
            cy.get('[data-cy=num-seed-input] > [data-cy=text-input]')
            .type('2')
            cy.get('[data-cy=num-worker-input] > [data-cy=text-input]')
            .type('2')
            cy.get('[data-cy=minute-input] > [data-cy=text-input]')
            .type('60')
            .blur()
        })

        it('Hour/Tray Seeding/Row Feet/Date/Without Comment', () => {
            let startdate = dayjs('1999-10-05', 'YYYY-MM-DD')
            let enddate = dayjs('1999-10-07', 'YYYY-MM-DD')
            let startunix = startdate.unix()
            let endunix = enddate.unix()
            let url = '/log.json?type=farm_seeding&timestamp[gt]='+startunix+'&timestamp[lt]='+ endunix
            let logID = ""
            let plantingID = "" 
            cy.intercept('POST', 'log').as('logCreation')
            cy.get('[data-cy=submit-button]')
                .click()
            cy.get('[data-cy=confirm-button]')
                .click()
            cy.wait('@logCreation') // wait for the log creation
                .then(interception => {
                    // read the response
                    expect(interception.response.statusCode).to.eq(201)
                    cy.wrap(getRecord(url)).as('getSeedingLog')
                })
                
            cy.get('@getSeedingLog').should((response) => {
                expect(response.data.list.length).to.equal(1)
                var data = response.data.list[0]
                logID = data.id
                expect(data.movement.area[0].name).to.equal('CHUAU')
                expect(data.quantity[0].value).to.equal('2') // num seeds                 
                expect(data.quantity[1].value).to.equal('2') // num tray               
                expect(data.quantity[2].value).to.equal('2') // num tray/cell                
                expect(data.quantity[3].value).to.equal('1') // labor                 
                expect(data.quantity[4].value).to.equal('2') // workers    
                expect(data.timestamp).to.equal('939168000') // timestamp for 1999-10-06            
            })
            .then((response) => {
                var data = response.data.list[0]
                var plantingUrl = '/farm_asset.json?type=planting&id=' + data.asset[0].id
                cy.wrap(getRecord(plantingUrl)).as('getPlantingAsset')
            })
            cy.get('@getPlantingAsset').should((response) => {
                var data = response.data.list[0]
                plantingID = data.id
                expect(response.data.list.length).to.equal(1)
                expect(data.crop[0].name).to.equal('ARUGULA')
                expect(data.name).to.equal('1999-10-06 ARUGULA CHUAU')                
            })
            .then(() => {       
                // We know we have correctly created the asset, so now delete it directly
                // from the database using the deleteRecord function from FarmOSAPI.js
                cy.wrap(deleteRecord("/log/" + logID , sessionToken)).as('seedingDelete')
            })
            // Wait here for the record to be deleted and check that it worked.
            cy.get('@seedingDelete').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            }) 
            .then(() => {
                cy.wrap(deleteRecord('/farm_asset/' + plantingID, sessionToken)).as('plantingDelete')
            })
            cy.get('@plantingDelete').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })
        })

        it('Minute/Direct Seeding/With comment', () => {
            let startdate = dayjs('1999-10-05', 'YYYY-MM-DD')
            let enddate = dayjs('1999-10-07', 'YYYY-MM-DD')
            let startunix = startdate.unix()
            let endunix = enddate.unix()
            let url = '/log.json?type=farm_seeding&timestamp[gt]='+startunix+'&timestamp[lt]='+ endunix
            let logID = ""
            let plantingID = "" 
            cy.get('[data-cy=direct-seedings]')
                .click()
            cy.get('[data-cy=direct-area-selection] > [data-cy=dropdown-input]')
                .select('A')
            cy.get('[data-cy=num-rowbed-input]')
                .type('3')
            cy.get('[data-cy=num-feet-input]')
                .type('3')
            cy.get('[data-cy=time-unit] > [data-cy=dropdown-input]')
                .select('hours')
            cy.get('[data-cy=hour-input]')
                .type('60')
            cy.get('[data-cy=comments]')
                .type('test comment')
                .blur()
            cy.intercept('POST', 'log').as('logCreation')
            cy.get('[data-cy=submit-button]')
                .click()
            cy.get('[data-cy=confirm-button]')
                .click()
            cy.wait('@logCreation') // wait for the log creation
                .then(interception => {
                    // read the response
                    expect(interception.response.statusCode).to.eq(201)
                    cy.wrap(getRecord(url)).as('getSeedingLog')
                })
                
            cy.get('@getSeedingLog').should((response) => {
                expect(response.data.list.length).to.equal(1)
                var data = response.data.list[0]
                logID = data.id
                expect(data.movement.area[0].name).to.equal('A')
                expect(data.quantity[0].value).to.equal('9') // num row Feet                 
                expect(data.quantity[1].value).to.equal('3') // num row bed                              
                expect(data.quantity[2].value).to.equal('60') // workers                 
                expect(data.quantity[3].value).to.equal('2') // hour    
                expect(data.timestamp).to.equal('939168000') // timestamp for 1999-10-06        
                expect(data.notes.value).to.contain('test comment') // comment should include 'test comment'
            })
            .then((response) => {
                var data = response.data.list[0]
                var plantingUrl = '/farm_asset.json?type=planting&id=' + data.asset[0].id
                cy.wrap(getRecord(plantingUrl)).as('getPlantingAsset')
            })
            cy.get('@getPlantingAsset').should((response) => {
                var data = response.data.list[0]
                plantingID = data.id
                expect(response.data.list.length).to.equal(1)
                expect(data.crop[0].name).to.equal('ARUGULA')
                expect(data.name).to.equal('1999-10-06 ARUGULA A')                
            })
            .then(() => {       
                // We know we have correctly created the asset, so now delete it directly
                // from the database using the deleteRecord function from FarmOSAPI.js
                cy.wrap(deleteRecord("/log/" + logID , sessionToken)).as('seedingDelete')
            })
            // Wait here for the record to be deleted and check that it worked.
            cy.get('@seedingDelete').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            }) 
            .then(() => {
                cy.wrap(deleteRecord('/farm_asset/' + plantingID, sessionToken)).as('plantingDelete')
            })
            cy.get('@plantingDelete').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })
        })
    })
    
})