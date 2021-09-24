const dayjs = require('dayjs')

var FarmOSAPI = require('../resources/FarmOSAPI.js')
var getAllPages = FarmOSAPI.getAllPages
var deleteRecord = FarmOSAPI.deleteRecord
var getSessionToken = FarmOSAPI.getSessionToken
var quantityLocation = FarmOSAPI.quantityLocation

describe('Test the seeding input page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2', {timeout: 60000})

        cy.visit('/farm/fd2-field-kit/seedingInput', {timeout: 120000})

        //makes sure that the area is loaded before continueing
        cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).contains('A', {timeout: 130000})
        })
    })
    context('test inputs and buttons', () => {
        it('button is disabled', () => {
            cy.get('[data-cy=submit-button]')
                .should('exist')
                .should('be.disabled')
        })
        it('input new date', () => {
            cy.get('[data-cy=date-selection')
                .should('exist')

            cy.get('[data-cy=date-select')
                .should('exist')
                .type('2011-05-07')
        })
        it('select a crop', () => {
            cy.get('[data-cy=crop-selection')
                .should('exist')
            
            cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
                cy.get($dropdowns[0]).should('exist')
                    .select('BEAN')
                    .should('have.value', 'BEAN')
            })  
        })
        it('select a area', () => {
            cy.get('[data-cy=area-selection')
                .should('exist') 
            
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).should('exist')
                    .select('A')
                    .should('have.value', 'A')
            })
        }) 
        it('input num of workers', () => {
            cy.get('[data-cy=num-workers]')
                .should('exist')
                .click()
                .clear()
                .type('2')
                .should('have.value', '2')
        })
        it('input time spent', () => {
            cy.get('[data-cy=time-spent]')
                .should('exist')
                .click()
                .clear()
                .type('10')
                .should('have.value', '10')
        })
        it('select time unit', () => {
            cy.get('[data-cy=time-unit]')
                .should('exist')

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[2]).should('exist')
                    .should('have.value', 'minutes')
                    .select('hours')
                    .should('have.value', 'hours')
            })
        })
        it('input comments', () => {
            cy.get('[data-cy=comments]')
                .should('exist')
                .type('Yeeewhaw')
                .should('have.value', 'Yeeewhaw')
        })
    })
    context('select direct seedings and test its inputs', () => {
        beforeEach(()=> {
            cy.get('[data-cy=direct-seedings').check()
        })
        it('select Direct Seeding', () => {
            cy.get('[data-cy=direct-seedings]')
                .should('exist')
                .check()
                .should('be.checked')
        })
        it('input a row per bed number', () =>{
            cy.get('[data-cy=row-bed]')
                .should('exist')
                .click()
                .clear()
                .type('5')
                .should('have.value', '5')
        })
        it('input the number of feet', () => {
            cy.get('[data-cy=num-feet')
                .should('exist')
                .click()
                .clear()
                .type('20')
                .should('have.value', '20')
        })
        it('select feet unit(ei. bed or row)', () => {
            cy.get('[data-cy=unit-feet')
                .should('exist')

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[2]).should('exist')
                    .should('have.value', 'bed')
                    .select('row')
                    .should('have.value', 'row')
            })
        })
        it('Tray Seeding inputs should not exist in DOM', () => {
            cy.get('[data-cy=trays-planted]')
                .should('not.exist')

            cy.get('[data-cy=cells-tray]')
                .should('not.exist')

            cy.get('[data-cy=seeds-planted')
                .should('not.exist')
        })
    })
    context('select tray seedings and test its inputs', () => {
        beforeEach(() => {
            cy.get('[data-cy=tray-seedings]').click()
        })
        it('select Tray Seeding', () => {
            cy.get('[data-cy=tray-seedings]')
                .should('exist')
                .check()
                .should('be.checked')
        })
        it('input number of Trays', () => {
            cy.get('[data-cy=trays-planted')
                .should('exist')
                .click()
                .clear()
                .type('3')
                .should('have.value', '3')
        })
        it('input number of Cells per Tray', () => {
            cy.get('[data-cy=cells-tray')
                .should('exist')
                .click()
                .clear()
                .type('25')
                .should('have.value', '25')
        })
        it('input number of seeds planted', () => {
            cy.get('[data-cy=seeds-planted')
                .should('exist')
                .click()
                .clear()
                .type('76')
                .should('have.value', '76')
        })
        it('Direct Seeding inputs should not exist in DOM', () => {
            cy.get('[data-cy=row-bed]')
                .should('not.exist')

            cy.get('[data-cy=num-feet')
                .should('not.exist')

            cy.get('[data-cy=unit-feet')
                .should('not.exist')
        })
    })
    context('check that button not disabled', () => {
        beforeEach(() => {
            cy.get('[data-cy=date-select')
                .type('2011-05-07')

            cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
                cy.get($dropdowns[0]).select('BEAN')
            })

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).select('A')
            })

            cy.get('[data-cy=num-workers]')
                .clear()
                .type('2')

             cy.get('[data-cy=time-spent]')
                .clear()
                .type('10')
        })
        it('submit button is not disabled when direct seeding is filled in', () => {
            cy.get('[data-cy=direct-seedings').check()

            cy.get('[data-cy=row-bed]')
                .clear()
                .type('5')

            cy.get('[data-cy=num-feet')
                .clear()
                .type('20')

            cy.get('[data-cy=submit-button')
                .should('exist')
                .should('not.be.disabled')
        })
        it('submit button is not disabled when trayseeding is filled in',() => {
            cy.get('[data-cy=tray-seedings]').click()

            cy.get('[data-cy=trays-planted')
                .clear()
                .type('3')

            cy.get('[data-cy=cells-tray')
                .clear()
                .type('25')

            cy.get('[data-cy=seeds-planted')
                .clear()
                .type('76')

            cy.get('[data-cy=submit-button')
                .should('exist')
                .should('not.be.disabled')
        })
    })
    context.only('create logs in database', () => {
        let seedingLog = []
        let plantingLog = []
        let token = 0
        beforeEach(() => {
            seedingLog = []
            plantingLog = []
            token = 0

            cy.get('[data-cy=date-select')
                .type('2011-08-09')

            cy.get('[data-cy=time-spent]')
                .clear()
                .type('10')
            
            cy.get('[data-cy=num-workers]')
                .clear()
                .type('2')

            cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
                cy.get($dropdowns[0]).select('BEET')
            })
            
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).select('C')
            })
        })
        afterEach(() => {
            cy.wait(10000)

            cy.wrap(deleteRecord('/log/' + seedingLog[0].id, token)).as('deleteSeedingsLog')

            cy.get('@deleteSeedingsLog').should(function(response) {
                expect(response.status).to.equal(200)
            })

            cy.wrap(deleteRecord('/log/' + plantingLog[0].id, token)).as('deletePlantingLog')

            cy.get('@deletePlantingLog').should(function(response){
                expect(response.status).to.equal(200)
            })
        })
        context('All creation of tray seeding logs test', () => {
            beforeEach(() => {
                cy.get('[data-cy=tray-seedings]').check()

                cy.get('[data-cy=trays-planted')
                    .clear()
                    .type('3')

                cy.get('[data-cy=cells-tray')
                    .clear()
                    .type('25')

                cy.get('[data-cy=seeds-planted')
                    .clear()
                    .type('76')
            })
            it('create a tray seedings log and a planting log w/ minutes', () => {
                cy.get('[data-cy=submit-button]')
                    .click()

                cy.on("window:confirm", () => false)

                cy.wait(30000).then(() => {
                    cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getLog')

                    cy.get('@getLog').should(function(){
                        expect(seedingLog.length).to.equal(1)
                        expect(seedingLog[0].movement.area[0].name).to.equal('C')
                        expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Labor')].value).to.equal('0.17')
                    })
                }).then(() => {
                    cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

                    cy.get('@getPlanting').should(function(){
                        expect(plantingLog.length).to.equal(1)
                        expect(plantingLog[0].crop[0].name).to.equal('BEET')
                    })
                }).then(() => {
                    cy.wrap(getSessionToken()).as('token')
                    cy.get('@token').should(function(sessionToken){
                        token = sessionToken
                    })
                })
            })
            it('create a tray seedings log and a planting log w/ hours', () => {
                cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                    cy.get($dropdowns[2]).select('hours')
                })
                
                cy.get('[data-cy=submit-button]')
                    .click()

                cy.on("window:confirm", () => false)

                cy.wait(30000).then(() => {
                    cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getLog')

                    cy.get('@getLog').should(function(){
                        expect(seedingLog.length).to.equal(1)
                        expect(seedingLog[0].movement.area[0].name).to.equal('C')
                        expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Labor')].value).to.equal('10')
                    })
                }).then(() => {
                    cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

                    cy.get('@getPlanting').should(function(){
                        expect(plantingLog.length).to.equal(1)
                        expect(plantingLog[0].crop[0].name).to.equal('BEET')
                    })
                }).then(() => {
                    cy.wrap(getSessionToken()).as('token')
                    cy.get('@token').should(function(sessionToken){
                        token = sessionToken
                    })
                })
            })
        })
        context('All tests creating a direct seeding', () => {
            beforeEach(() => {
                cy.get('[data-cy=direct-seedings]').check()

                cy.get('[data-cy=row-bed]')
                    .clear()
                    .type('5')

                cy.get('[data-cy=num-feet')
                    .clear()
                    .type('20')
            })
            it('create a direct seedings log and a planting log w/ minute and bed', () => {
                cy.get('[data-cy=submit-button]')
                    .click()

                cy.on("window:confirm", () => false)

                cy.wait(30000).then(() => {
                    cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getSeeding')
                    
                    cy.get('@getSeeding').should(function(){
                        expect(seedingLog.length).to.equal(1)
                        expect(seedingLog[0].movement.area[0].name).to.equal('C')
                        expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Labor')].value).to.equal('0.17')
                        expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Amount planted')].value).to.equal('100')
                    })
                }).then(() => {
                    cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

                    cy.get('@getPlanting').should(function(){
                        expect(plantingLog.length).to.equal(1)
                        expect(plantingLog[0].crop[0].name).to.equal('BEET')
                    })
                }).then(() => {
                    cy.wrap(getSessionToken()).as('token')
                    cy.get('@token').should(function(sessionToken){
                        token = sessionToken
                    })
                })
            })
            it('create a direct seedings log and a planting log w/ hour and row', () => {
                cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                    cy.get($dropdowns[3]).select('hours')
                })

                cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                    cy.get($dropdowns[2]).select('row')
                })

                cy.get('[data-cy=submit-button]')
                    .click()

                cy.on("window:confirm", () => false)

                cy.wait(30000).then(() => {
                    cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getSeeding')
                    
                    cy.get('@getSeeding').should(function(){
                        expect(seedingLog.length).to.equal(1)
                        expect(seedingLog[0].movement.area[0].name).to.equal('C')
                        expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Labor')].value).to.equal('10')
                        expect(seedingLog[0].quantity[quantityLocation(seedingLog[0].quantity, 'Amount planted')].value).to.equal('20')
                    })
                }).then(() => {
                    cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

                    cy.get('@getPlanting').should(function(){
                        expect(plantingLog.length).to.equal(1)
                        expect(plantingLog[0].crop[0].name).to.equal('BEET')
                    })
                }).then(() => {
                    cy.wrap(getSessionToken()).as('token')
                    cy.get('@token').should(function(sessionToken){
                        token = sessionToken
                    })
                })
            })
        }) 
        context('Test that popup will send to Seeding Report Page or not', () => {
            beforeEach(() => {
                cy.get('[data-cy=tray-seedings]').check()

                cy.get('[data-cy=trays-planted')
                    .clear()
                    .type('3')

                cy.get('[data-cy=cells-tray')
                    .clear()
                    .type('25')

                cy.get('[data-cy=seeds-planted')
                    .clear()
                    .type('76')
            })
            it('creates a tray seeding report, sends it to the report page', () =>{
                cy.get('[data-cy=submit-button').click()

                cy.wait(30000).then(() => {
                    cy.location().should((loc) => {
                        expect(loc.pathname).to.equal('/farm/fd2-barn-kit/seedingReport')
                    })
                }).then(() => {
                    cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getSeeding')
                }).then(() => {
                    cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')
                }).then(() => {
                    cy.wrap(getSessionToken()).as('token')
                    cy.get('@token').should(function(sessionToken){
                        token = sessionToken
                    })
                })
            })
            it('creates a tray seeding report, sends it to the input page', () =>{
                cy.get('[data-cy=submit-button]')
                    .click()

                cy.on("window:confirm", () => false)

                cy.wait(30000).then(() => {
                    cy.location().should((loc) => {
                        expect(loc.pathname).to.equal('/farm/fd2-field-kit/seedingInput')
                    })
                }).then(() => {
                    cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), seedingLog)).as('getSeeding')
                }).then(() => {
                    cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + seedingLog[0].asset[0].id, plantingLog)).as('getPlanting')
                }).then(() => {
                    cy.wrap(getSessionToken()).as('token')
                    cy.get('@token').should(function(sessionToken){
                        token = sessionToken
                    })
                })
            })
        })
    })
})