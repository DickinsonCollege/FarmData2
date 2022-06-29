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

            // Waiting for the initial API calls to complete when the page is first loaded
            // They have to be loaded in the first visit to be saved in the localStorage.
            cy.wrap(getCropToIDMap()).as('cropMap')
            cy.wrap(getAreaToIDMap()).as('areaMap')
            cy.get('@cropMap').should(function(map) {
                cropToIDMap = map
            })
            cy.get('@areaMap').should(function(map) {
                areaToIDMap = map
            })
            expect(crops).to.equal(null)
            expect(areas).to.equal(null)

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
            cy.visit('/farm/fd2-field-kit/seedingInput')

            // Wait here for the maps to load in the page.
            
            cy.wait(['@cropmap', '@areamap'])
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

        it.only('test if areas are correctly loaded to the dropdown for tray seeding', () => {
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
            

           

            // cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
            //     cy.get($dropdowns[2]).should('exist')
            //         .select('A', { force: true })   // force select to disregard :disabled
            //         .should('have.value', 'A')
            // })

            // cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
            //     cy.get($dropdowns[2]).should('exist')
            //         .select('B', { force: true })   // force select to disregard :disabled
            //         .should('have.value', 'B')
            // })
        })
    })
    
    
    // context('Normal Features tests', () => {
    //     context('Non-API related dropdown tests', () => {
    //         beforeEach(() => {
    //         });
    //     })
    // })
        
        // context('Unit', () => {
        //     beforeEach(() => {
        //         cy.login('manager1', 'farmdata2')
        //         .then(() => {
        //             // Using wrap to wait for the asynchronus API request.
        //                 cy.wrap(getUnitToIDMap()).as('unitMap')    
        //         })

        //         // Wait here for the maps in the tests.
        //         cy.get('@unitMap').should(function(map) {
        //             unitToIDMap = map
        //         })
                
        //         // Setting up wait for the request in the created() to complete.
        //         cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitmap')
        //         cy.visit('/farm/fd2-field-kit/seedingInput')

        //         // Wait here for the maps and sesson token to load in the page.
                
        //         cy.wait(['@unitmap']) 
        //     })

        //     it.only('test if units are correctly loaded to the dropdown', () => {
        //         cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
        //             cy.get($dropdowns[4]).should('exist')
        //                 .select('CHUAU',)   // force select to disregard :disabled
        //                 .should('have.value', 'CHUAU')
        //         })
        
        // })   
        
    //     cy.login('manager1', 'farmdata2')
    //     .then(() => {
    //         // Using wrap to wait for the asynchronus API request.
    //         cy.wrap(getSessionToken()).as('token')
    //         cy.wrap(getCropToIDMap()).as('cropMap')
    //         cy.wrap(getAreaToIDMap()).as('areaMap')
    //         cy.wrap(getUserToIDMap()).as('userMap')
    //         cy.wrap(getUnitToIDMap()).as('unitMap')
    //         cy.wrap(getLogTypeToIDMap()).as('logTypeMap')
    //     })
        
        
    //     // Waiting for the session token and maps to load.
    //     cy.get('@token').should(function(token) {
    //         sessionToken = token
    //     })
    //     cy.get('@cropMap').should(function(map) {
    //         cropToIDMap = map
    //     })
    //     cy.get('@areaMap').should(function(map) {
    //         areaToIDMap = map
    //     })
    //     cy.get('@userMap').should(function(map) {
    //         userToIDMap = map
    //     })
    //     cy.get('@unitMap').should(function(map) {
    //             unitToIDMap = map
    //         })        
    //         cy.get('@logTypeMap').should(function(map) {
    //             logTypeToIDMap = map
    //         })
            
    //         // Setting up wait for the request in the created() to complete.
                // cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
                // cy.intercept('GET', 'restws/session/token').as('sessiontok')
                // cy.intercept('GET', 'user').as('usermap')
                // cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap')        
                // cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitmap')
                // cy.intercept('GET', 'taxonomy_term.json?bundle=farm_log_categories').as('logtypemap')
                // cy.visit('/farm/fd2-field-kit/seedingInput')
            
            
    //         cy.visit('/farm/fd2-field-kit/seedingInput')
            
    //         // Wait here for the map and token to be loaded in the page 
    //         // Sessiontok and cropmap are the only two that get loaded when page is enterd.
    //         cy.wait(['@sessiontok','@cropmap'])
            
    //     })
    // })
    













    // context('test inputs and buttons', () => {
    //     it('button is disabled', () => {
    //         cy.get('[data-cy=submit-button]')
    //             .should('exist')
    //             .should('be.disabled')
    //     })
    //     it('input new date', () => {
    //         cy.get('[data-cy=date-selection')
    //             .should('exist')

    //         cy.get('[data-cy=date-select')
    //             .should('exist')
    //             .type('2011-05-07')
    //     })
    //     it('select a crop', () => {
    //         cy.get('[data-cy=crop-selection')
    //             .should('exist')
            
    //         cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
    //             cy.get($dropdowns[0]).should('exist')
    //                 .select('BEAN')
    //                 .should('have.value', 'BEAN')
    //         })  
    //     })
    //     it('select a area', () => {
    //         cy.get('[data-cy=area-selection')
    //             .should('exist') 
            
    //         cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //             cy.get($dropdowns[1]).should('exist')
    //                 .select('A')
    //                 .should('have.value', 'A')
    //         })
    //     }) 
    //     it('input num of workers', () => {
    //         cy.get('[data-cy=num-workers]')
    //             .should('exist')
    //             .click()
    //             .clear()
    //             .type('2')
    //             .should('have.value', '2')
    //     })
    //     it('input time spent', () => {
    //         cy.get('[data-cy=time-spent]')
    //             .should('exist')
    //             .click()
    //             .clear()
    //             .type('10')
    //             .should('have.value', '10')
    //     })
    //     it('select time unit', () => {
    //         cy.get('[data-cy=time-unit]')
    //             .should('exist')

    //         cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //             cy.get($dropdowns[2]).should('exist')
    //                 .should('have.value', 'minutes')
    //                 .select('hours')
    //                 .should('have.value', 'hours')
    //         })
    //     })
    //     it('input comments', () => {
    //         cy.get('[data-cy=comments]')
    //             .should('exist')
    //             .type('Yeeewhaw')
    //             .should('have.value', 'Yeeewhaw')
    //     })
    // })
    // context('select direct seedings and test its inputs', () => {
    //     beforeEach(()=> {
    //         cy.get('[data-cy=direct-seedings').check()
    //     })
    //     it('select Direct Seeding', () => {
    //         cy.get('[data-cy=direct-seedings]')
    //             .should('exist')
    //             .check()
    //             .should('be.checked')
    //     })
    //     it('input a row per bed number', () =>{
    //         cy.get('[data-cy=row-bed]')
    //             .should('exist')
    //             .click()
    //             .clear()
    //             .type('5')
    //             .should('have.value', '5')
    //     })
    //     it('input the number of feet', () => {
    //         cy.get('[data-cy=num-feet')
    //             .should('exist')
    //             .click()
    //             .clear()
    //             .type('20')
    //             .should('have.value', '20')
    //     })
    //     it('select feet unit(ei. bed or row)', () => {
    //         cy.get('[data-cy=unit-feet')
    //             .should('exist')

    //         cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //             cy.get($dropdowns[2]).should('exist')
    //                 .should('have.value', 'bed')
    //                 .select('row')
    //                 .should('have.value', 'row')
    //         })
    //     })
    //     it('Tray Seeding inputs should not exist in DOM', () => {
    //         cy.get('[data-cy=trays-planted]')
    //             .should('not.exist')

    //         cy.get('[data-cy=cells-tray]')
    //             .should('not.exist')

    //         cy.get('[data-cy=seeds-planted')
    //             .should('not.exist')
    //     })
    // })
    // context('select tray seedings and test its inputs', () => {
    //     beforeEach(() => {
    //         cy.get('[data-cy=tray-seedings]').click()
    //     })
    //     it('select Tray Seeding', () => {
    //         cy.get('[data-cy=tray-seedings]')
    //             .should('exist')
    //             .check()
    //             .should('be.checked')
    //     })
    //     it('input number of Trays', () => {
    //         cy.get('[data-cy=trays-planted')
    //             .should('exist')
    //             .click()
    //             .clear()
    //             .type('3')
    //             .should('have.value', '3')
    //     })
    //     it('input number of Cells per Tray', () => {
    //         cy.get('[data-cy=cells-tray')
    //             .should('exist')
    //             .click()
    //             .clear()
    //             .type('25')
    //             .should('have.value', '25')
    //     })
    //     it('input number of seeds planted', () => {
    //         cy.get('[data-cy=seeds-planted')
    //             .should('exist')
    //             .click()
    //             .clear()
    //             .type('76')
    //             .should('have.value', '76')
    //     })
    //     it('Direct Seeding inputs should not exist in DOM', () => {
    //         cy.get('[data-cy=row-bed]')
    //             .should('not.exist')

    //         cy.get('[data-cy=num-feet')
    //             .should('not.exist')

    //         cy.get('[data-cy=unit-feet')
    //             .should('not.exist')
    //     })
    // })
    // context('check that button not disabled', () => {
    //     beforeEach(() => {
    //         cy.get('[data-cy=date-select')
    //             .type('2011-05-07')

    //         cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
    //             cy.get($dropdowns[0]).select('BEAN')
    //         })

    //         cy.get('[data-cy=num-workers]')
    //             .clear()
    //             .type('2')

    //          cy.get('[data-cy=time-spent]')
    //             .clear()
    //             .type('10')
    //     })
    //     it('submit button is not disabled when direct seeding is filled in', () => {
    //         cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //             cy.get($dropdowns[1]).select('A')
    //         })
            
    //         cy.get('[data-cy=direct-seedings').check()

    //         cy.get('[data-cy=row-bed]')
    //             .clear()
    //             .type('5')

    //         cy.get('[data-cy=num-feet')
    //             .clear()
    //             .type('20')

    //         cy.get('[data-cy=submit-button')
    //             .should('exist')
    //             .should('not.be.disabled')
    //     })
    //     it('submit button is not disabled when trayseeding is filled in',() => {
    //         cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //             cy.get($dropdowns[1]).select('CHUAU')
    //         })
            
    //         cy.get('[data-cy=tray-seedings]').click()

    //         cy.get('[data-cy=trays-planted')
    //             .clear()
    //             .type('3')

    //         cy.get('[data-cy=cells-tray')
    //             .clear()
    //             .type('25')

    //         cy.get('[data-cy=seeds-planted')
    //             .clear()
    //             .type('76')

    //         cy.get('[data-cy=submit-button')
    //             .should('exist')
    //             .should('not.be.disabled')
    //     })
    // })
    // context('check area filter', () => {
    //     it('only shows greenhouses when tray seeding is selected', () =>{
    //         cy.get('[data-cy=tray-seedings]').click()
    //         //tests that the beds are not in the dropdown
    //         cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //             cy.get($dropdowns[1]).should('exist')
    //                 .contains('CHUAU')
    //                 .contains('ALF-1').should('not.exist')
    //         })
    //         //tests that the fields are not in the dropdown
    //         cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //             cy.get($dropdowns[1]).should('exist')
    //                 .contains('CHUAU')
    //                 .contains('E').should('not.exist') 
    //         })
    //     })
    //     it('only shows beds or fields when direct seeding is selected', () =>{
    //         cy.get('[data-cy=direct-seedings').click()

    //         cy.get('[data-cy=dropdown-input]').then(($dropdowns) =>{
    //             cy.get($dropdowns[1]).should('exist')
    //                 .contains('ALF-1')
    //                 .contains('A')
    //                 .contains('CHUAU').should('not.exist')
    //         })
    //     })
    // })
    // context('create logs in database', () => {
    //     let seedingLog = []
    //     let plantingLog = []
    //     let token = 0
    //     beforeEach(() => {
    //         seedingLog = []
    //         plantingLog = []
    //         token = 0

    //         cy.get('[data-cy=date-select')
    //             .type('2011-08-09')

    //         cy.get('[data-cy=time-spent]')
    //             .clear()
    //             .type('10')
            
    //         cy.get('[data-cy=num-workers]')
    //             .clear()
    //             .type('2')

    //         cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
    //             cy.get($dropdowns[0]).select('BEET')
    //         })
            
    //         cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //             cy.get($dropdowns[1]).select('C')
    //         })
    //     })
    //     afterEach(() => {
    //         cy.wait(10000)

    //         cy.wrap(deleteRecord('/log/' + seedingLog[0].id, token)).as('deleteSeedingsLog')

    //         cy.get('@deleteSeedingsLog').should(function(response) {
    //             expect(response.status).to.equal(200)
    //         })

    //         cy.wrap(deleteRecord('/log/' + plantingLog[0].id, token)).as('deletePlantingLog')

    //         cy.get('@deletePlantingLog').should(function(response){
    //             expect(response.status).to.equal(200)
    //         })
    //     })
    //     context('All creation of tray seeding logs test', () => {
    //         beforeEach(() => {
    //             cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //                 cy.get($dropdowns[1]).select('CHUAU')
    //             })
    //             cy.get('[data-cy=tray-seedings]').check()

    //             cy.get('[data-cy=trays-planted')
    //                 .clear()
    //                 .type('3')

    //             cy.get('[data-cy=cells-tray')
    //                 .clear()
    //                 .type('25')

    //             cy.get('[data-cy=seeds-planted')
    //                 .clear()
    //                 .type('76')
    //         })
    //         it('create a tray seedings log and a planting log w/ minutes', () => {
    //             cy.get('[data-cy=submit-button]')
    //                 .click()

    //             cy.on("window:confirm", () => false)

    //             cy.wait(30000).then(() => {
    //                 cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getLog')

    //                 cy.get('@getLog').should(function(){
    //                     expect(seedingLog.length).to.equal(1)
    //                     expect(seedingLog[0].movement.area[0].name).to.equal('CHUAU')
    //                     expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Labor')].value).to.equal('0.17')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

    //                 cy.get('@getPlanting').should(function(){
    //                     expect(plantingLog.length).to.equal(1)
    //                     expect(plantingLog[0].crop[0].name).to.equal('BEET')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getSessionToken()).as('token')
    //                 cy.get('@token').should(function(sessionToken){
    //                     token = sessionToken
    //                 })
    //             })
    //         })
    //         it('create a tray seedings log and a planting log w/ hours', () => {
    //             cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //                 cy.get($dropdowns[2]).select('hours')
    //             })
                
    //             cy.get('[data-cy=submit-button]')
    //                 .click()

    //             cy.on("window:confirm", () => false)

    //             cy.wait(30000).then(() => {
    //                 cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getLog')

    //                 cy.get('@getLog').should(function(){
    //                     expect(seedingLog.length).to.equal(1)
    //                     expect(seedingLog[0].movement.area[0].name).to.equal('CHUAU')
    //                     expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Labor')].value).to.equal('10')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

    //                 cy.get('@getPlanting').should(function(){
    //                     expect(plantingLog.length).to.equal(1)
    //                     expect(plantingLog[0].crop[0].name).to.equal('BEET')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getSessionToken()).as('token')
    //                 cy.get('@token').should(function(sessionToken){
    //                     token = sessionToken
    //                 })
    //             })
    //         })
    //     })
    //     context('All tests creating a direct seeding', () => {
    //         beforeEach(() => {
    //             cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //                 cy.get($dropdowns[1]).select('C')
    //             })

    //             cy.get('[data-cy=direct-seedings]').check()

    //             cy.get('[data-cy=row-bed]')
    //                 .clear()
    //                 .type('5')

    //             cy.get('[data-cy=num-feet')
    //                 .clear()
    //                 .type('20')
    //         })
    //         it('create a direct seedings log and a planting log w/ minute and bed', () => {
    //             cy.get('[data-cy=submit-button]')
    //                 .click()

    //             cy.on("window:confirm", () => false)

    //             cy.wait(30000).then(() => {
    //                 cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getSeeding')
                    
    //                 cy.get('@getSeeding').should(function(){
    //                     expect(seedingLog.length).to.equal(1)
    //                     expect(seedingLog[0].movement.area[0].name).to.equal('C')
    //                     expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Labor')].value).to.equal('0.17')
    //                     expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Amount planted')].value).to.equal('100')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

    //                 cy.get('@getPlanting').should(function(){
    //                     expect(plantingLog.length).to.equal(1)
    //                     expect(plantingLog[0].crop[0].name).to.equal('BEET')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getSessionToken()).as('token')
    //                 cy.get('@token').should(function(sessionToken){
    //                     token = sessionToken
    //                 })
    //             })
    //         })
    //         it('create a direct seedings log and a planting log w/ hour and row', () => {
    //             cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //                 cy.get($dropdowns[3]).select('hours')
    //             })

    //             cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //                 cy.get($dropdowns[2]).select('row')
    //             })

    //             cy.get('[data-cy=submit-button]')
    //                 .click()

    //             cy.on("window:confirm", () => false)

    //             cy.wait(30000).then(() => {
    //                 cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getSeeding')
                    
    //                 cy.get('@getSeeding').should(function(){
    //                     expect(seedingLog.length).to.equal(1)
    //                     expect(seedingLog[0].movement.area[0].name).to.equal('C')
    //                     expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Labor')].value).to.equal('10')
    //                     expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Amount planted')].value).to.equal('20')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

    //                 cy.get('@getPlanting').should(function(){
    //                     expect(plantingLog.length).to.equal(1)
    //                     expect(plantingLog[0].crop[0].name).to.equal('BEET')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getSessionToken()).as('token')
    //                 cy.get('@token').should(function(sessionToken){
    //                     token = sessionToken
    //                 })
    //             })
    //         })
    //     }) 
    //     context('Test that popup will send to Seeding Report Page or not', () => {
    //         beforeEach(() => {
    //             cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
    //                 cy.get($dropdowns[1]).select('CHUAU')
    //             })

    //             cy.get('[data-cy=tray-seedings]').check()

    //             cy.get('[data-cy=trays-planted')
    //                 .clear()
    //                 .type('3')

    //             cy.get('[data-cy=cells-tray')
    //                 .clear()
    //                 .type('25')

    //             cy.get('[data-cy=seeds-planted')
    //                 .clear()
    //                 .type('76')
    //         })
    //         it('creates a tray seeding report, sends it to the report page', () =>{
    //             cy.get('[data-cy=submit-button').click()

    //             cy.wait(30000).then(() => {
    //                 cy.location().should((loc) => {
    //                     expect(loc.pathname).to.equal('/farm/fd2-barn-kit/seedingReport')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getSeeding')
    //             }).then(() => {
    //                 cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')
    //             }).then(() => {
    //                 cy.wrap(getSessionToken()).as('token')
    //                 cy.get('@token').should(function(sessionToken){
    //                     token = sessionToken
    //                 })
    //             })
    //         })
    //         it('creates a tray seeding report, sends it to the input page', () =>{
    //             cy.get('[data-cy=submit-button]')
    //                 .click()

    //             cy.on("window:confirm", () => false)

    //             cy.wait(30000).then(() => {
    //                 cy.location().should((loc) => {
    //                     expect(loc.pathname).to.equal('/farm/fd2-field-kit/seedingInput')
    //                 })
    //             }).then(() => {
    //                 cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getSeeding')
    //             }).then(() => {
    //                 cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')
    //             }).then(() => {
    //                 cy.wrap(getSessionToken()).as('token')
    //                 cy.get('@token').should(function(sessionToken){
    //                     token = sessionToken
    //                 })
    //             })
    //         })
    //     })
    // })
})