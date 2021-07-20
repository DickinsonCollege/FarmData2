const dayjs = require('dayjs')

var FarmOSAPI = require('../resources/FarmOSAPI.js')
var getAllPages = FarmOSAPI.getAllPages
var deleteRecord = FarmOSAPI.deleteRecord
var getSessionToken = FarmOSAPI.getSessionToken

describe('Test the seeding input page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2', {timeout: 45000})
    })
    context('sets up the page', () => {
        it('visits the page', () => {
            cy.visit('/farm/fd2-field-kit/seedingInput')
            //give some time for api requests to come in
            cy.wait(20000)
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
                    .select('minutes')
                    .should('have.value', 'minutes')
            })
        })
        it('input comments', () => {
            cy.get('[data-cy=comments]')
                .should('exist')
                .type('Yeeewhaw')
                .should('have.value', 'Yeeewhaw')
        })
        //last b/c it take sthe longest to load in
        it('select a area', () => {
            cy.get('[data-cy=area-selection')
                .should('exist') 
            
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).should('exist')
                    .select('A')
                    .should('have.value', 'A')
            })
        })   
    })
    context('select direct seedings and test its inputs', () => {
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
                cy.get($dropdowns[3]).should('exist')
                    .select('row')
                    .should('have.value', 'row')
            })
        })
        it('check that submit button is not disabled',() => {
            cy.get('[data-cy=submit-button')
                .should('exist')
                .should('not.be.disabled')
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
        it('submit button is not disabled', () => {
            cy.get('[data-cy=submit-button')
                .should('exist')
                .should('not.be.disabled')
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
    context('create logs in database', () => {
        it('create a tray seedings log and a planting log', () => {
            let traySeedingLog = []
            let plantingLog = []
            let plantingID = -1
            let token = 0
            
            cy.visit('/farm/fd2-field-kit/seedingInput', {timeout: 90000})

            cy.wait(37000)

            cy.get('[data-cy=date-select')
                .type('2011-05-07')

            cy.get('[data-cy=time-spent]')
                .clear()
                .type('10')
            
            cy.get('[data-cy=num-workers]')
                .clear()
                .type('2')

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[2]).select('minutes')
            }) 

            cy.get('[data-cy=tray-seedings]')
                .check()

            cy.get('[data-cy=trays-planted')
                .clear()
                .type('3')

            cy.get('[data-cy=cells-tray')
                .clear()
                .type('25')

             cy.get('[data-cy=seeds-planted')
                .clear()
                .type('76')

            cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
                cy.get($dropdowns[0]).select('BEAN')
            })
            
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).select('A')
            })

            cy.get('[data-cy=submit-button]')
                .click()

            cy.wait(30000).then(() => {
                cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-05-07').unix(), traySeedingLog)).as('getLog')

                cy.get('@getLog').should(function(){
                    expect(traySeedingLog.length).to.equal(1)
                    expect(traySeedingLog[0].movement.area[0].name).to.equal('A')
                })
            }).then(() => {
                cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + traySeedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

                cy.get('@getPlanting').should(function(){
                    expect(plantingLog.length).to.equal(1)
                    expect(plantingLog[0].crop[0].name).to.equal('BEAN')
                })
            }).then(() => {
                cy.wrap(getSessionToken()).as('token')
                cy.get('@token').should(function(sessionToken){
                    token = sessionToken
                })
            }).then(() => {
                cy.wrap(deleteRecord('/log/' + traySeedingLog[0].id, token)).as('deleteSeedingsLog')

                cy.get('@deleteSeedingsLog').should(function(response) {
                    expect(response.status).to.equal(200)
                })

                cy.wrap(deleteRecord('/log/' + plantingLog[0].id, token)).as('deletePlantingLog')

                cy.get('@deletePlantingLog').should(function(response){
                    expect(response.status).to.equal(200)
                })
            })
        })
        it.only('create a direct seedings log and a planting log', () => {
            let directSeedingLog = []
            let plantingLog = []
            let plantingID = -1
            let token = 0

            cy.visit('/farm/fd2-field-kit/seedingInput', {timeout: 90000})

            cy.wait(40000)

            cy.get('[data-cy=date-select')
                .type('2011-08-09')

            cy.get('[data-cy=time-spent]')
                .clear()
                .type('10')
            
            cy.get('[data-cy=num-workers]')
                .clear()
                .type('2')

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[2]).select('minutes')
            }) 

            cy.get('[data-cy=direct-seedings]')
                .check()

            cy.get('[data-cy=row-bed]')
                .clear()
                .type('5')

            cy.get('[data-cy=num-feet')
                .clear()
                .type('20')

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[3]).select('bed')
            })

            cy.get('[data-cy=dropdown-input').then(($dropdowns) => {
                cy.get($dropdowns[0]).select('BEET')
            })
            
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).select('C')
            })

            cy.get('[data-cy=submit-button]')
                .click()

            cy.wait(30000).then(() => {
                cy.wrap(getAllPages('/log.json?type=farm_seeding&timestamp=' + dayjs('2011-08-09').unix(), directSeedingLog)).as('getSeeding')
                console.log(dayjs('2011-08-09').unix())
                cy.get('@getSeeding').should(function(){
                    console.log(directSeedingLog)
                    expect(directSeedingLog.length).to.equal(1)
                    expect(directSeedingLog[0].movement.area[0].name).to.equal('C')
                })
            }).then(() => {
                cy.wrap(getAllPages('/farm_asset.json?type=planting&id=' + directSeedingLog[0].asset[0].id, plantingLog)).as('getPlanting')

                cy.get('@getPlanting').should(function(){
                    expect(plantingLog.length).to.equal(1)
                    expect(plantingLog[0].crop[0].name).to.equal('BEET')
                })
            }).then(() => {
                cy.wrap(getSessionToken()).as('token')
                cy.get('@token').should(function(sessionToken){
                    token = sessionToken
                })
            }).then(() => {
                cy.wrap(deleteRecord('/log/' + directSeedingLog[0].id, token)).as('deleteSeedingLog')

                cy.get('@deleteSeedingLog').should(function(response){
                    expect(response.status).to.equal(200)
                })

                cy.wrap(deleteRecord('/log/' + plantingLog[0].id, token)).as('deletePlantingLog')

                cy.get('@deletePlantingLog').should(function(response){
                    expect(response.status).to.equal(200)
                })
            })
        })
    })
})