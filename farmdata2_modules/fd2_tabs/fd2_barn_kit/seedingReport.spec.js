const dayjs = require('dayjs')
var FarmOSAPI = require('../resources/FarmOSAPI.js')
var getSessionToken = FarmOSAPI.getSessionToken
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var getIDToCropMap = FarmOSAPI.getIDToCropMap
var getAreaToIDMap = FarmOSAPI.getAreaToIDMap
var getUserToIDMap = FarmOSAPI.getUserToIDMap
var getUnitToIDMap = FarmOSAPI.getUnitToIDMap
var createRecord = FarmOSAPI.createRecord
var deleteRecord = FarmOSAPI.deleteRecord

describe('Testing for the seeding report page', () => {
    let cropToIDMap = null
    let IDToCropMap = null
    let areaToIDMap = null
    let userToIDMap = null
    let unitToIDMap = null

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
            .then(() => {
                // Using wrap to wait for the asynchronus API request.
                cy.wrap(getCropToIDMap()).as('cropMap')
                cy.wrap(getAreaToIDMap()).as('areaMap')
                cy.wrap(getIDToCropMap()).as('IDCropMap')
                cy.wrap(getUserToIDMap()).as('userMap')
                cy.wrap(getUnitToIDMap()).as('unitMap')
            })
        // Wait here for the maps in the tests.
        cy.get('@cropMap').should(function(map) {
            cropToIDMap = map
        })
        cy.get('@areaMap').should(function(map) {
            areaToIDMap = map
        })

        cy.get('@IDCropMap').should(function(map) {
            IDToCropMap = map
        })

        cy.get('@userMap').should(function(map) {
            userToIDMap = map
        })
                
        cy.get('@unitMap').should(function(map) {
            unitToIDMap = map
        })
                
        // Setting up wait for the request in the created() to complete.
        cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
        cy.intercept('GET', 'taxonomy_term.json?bundle=farm_areas').as('areamap') 
        cy.intercept('GET', '/taxonomy_term.json?bundle=farm_crops').as('IDCropMap')
        cy.intercept('GET', 'user').as('userMap') 

        cy.intercept('GET', 'taxonomy_term.json?bundle=farm_quantity_units').as('unitMap') 
                
        // cy.restoreLocalStorage()
        cy.visit('/farm/fd2-barn-kit/seedingReport')
    
        // Wait here for the maps to load in the page.   
        cy.wait(['@cropmap', '@areamap', '@IDCropMap', '@userMap', '@unitMap'])
    })

    context('can set dates and then render the report', () => {

        it('allows user input of the start and end dates', () => {
            cy.get('[data-cy=date-range-selection]')
                .should('exist')

            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2019-01-01')

            cy.get('[data-cy=end-date-select]')
                .should('exist')
                .type('2019-03-01')
                
            cy.get('[data-cy=date-select]')
                .each(($el, index, $all) => {
                    if (index == 0) {
                        expect($el).to.have.value('2019-01-01')
                    }
                    else if (index == 1){
                        expect($el).to.have.value('2019-03-01')
                    }
                })
        })

        it('generate report button renders the rest of the page', () => {
            cy.get('[data-cy=generate-rpt-btn]')
                .click()

            cy.get('[data-cy=filters-panel]')
                .should('exist')

            cy.get('[data-cy=report-table]')
                .should('exist')

            cy.get('[data-cy=direct-summary]')
                .should('exist')

            cy.get('[data-cy=tray-summary]')
                .should('exist')
        })       
    })

    context('assures filters are actually populated', () => {

        it('test if seeding type are correctly loaded to the filter dropdown', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'All')
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()  
                .next()
                .should('have.value', 'Direct Seedings')
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .last()
                .should('have.value', 'Tray Seedings')
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', '3')
        })

        it('test if crops are correctly loaded to the filter dropdown', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()

            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'All')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()  
                .next()
                .should('have.value', 'ARUGULA')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .last()
                .should('have.value', 'SCALLION')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', '22')
        })

        it('test if areas are correctly loaded to the filter dropdown', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()

            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()
                .should('have.value', 'All')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .first()  
                .next()
                .should('have.value', 'A')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .last()
                .should('have.value', 'SEEDING BENCH')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .children() 
                .should('have.length', '12')
        })
    })

    context('filter selection impacts other filter options', () => {

        it('test seeding type impact on other filters', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]').first()
            .select('Direct Seedings')
            for(let i = 0; i < 5; i++){
                cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('BOKCHOY')
                    })
            }
            for(let i = 0; i < 7; i++){
                cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('SEEDING BENCH')
                    })
            }

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]').first()
                .select('Tray Seedings')

            for(let i = 0; i < 18; i++){
                cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('CARROT')
                    })
            }
            for(let i = 0; i < 6; i++){
                cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('A')
                    })
            }
        })

        it('test crop filter impact on other filters', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').first()
                .select('CARROT')
            for(let i = 0; i < 2; i++){
                cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('Tray Seedings')
                    })
            }
            for(let i = 0; i < 2; i++){
                cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('SEEDING BENCH')
                    })
            }

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]').first()
                .select('All')
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
                .select('BOKCHOY')
            for(let i = 0; i < 2; i++){
                cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('Direct Seedings')
                    })
            }
            for(let i = 0; i < 2; i++){
                cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('A')
                    })
            }
        })

        it('test area filter impact on other filters', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]').first()
                .select('A')

            for(let i = 0; i < 2; i++){
                cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('Tray Seedings')
                    })
            }

            for(let i = 0; i < 2; i++){
                cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('CARROTS')
                    })
            }

            cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input]').first()
                .select('All')
            cy.get('[data-cy=area-dropdown] > [data-cy=dropdown-input]')
                .select('ORION')

            for(let i = 0; i < 2; i++){
                cy.get('[data-cy=seeding-type-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('Direct Seedings')
                    })
            }

            for(let i = 0; i < 8; i++){
                cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input] > [data-cy=option' + i + ']')
                    .invoke('text')
                    .then(thisOption => {
                        expect(thisOption).to.not.equal('CARROTS')
                    })
            }
        })
    })

    context('can see spinner at appropriate times', () => {

        it('show spinner after input', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=loader]').should('be.visible')
        })

        it('spinner dissappears after whole response returns 1 page', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-02-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=report-table]').find('tr').its('length').then(length =>{
                expect(length).to.equal(3)
                cy.get('[data-cy=loader]').should('not.exist')
            }) 
        })

        it('spinner reappears after changing values and clicking again', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-03')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=loader]').should('be.visible')
        })
    })

    context('clicking on date ranges hides report', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('clicking on start date range hides report', () => {
            cy.get('[data-cy=report-table]').should('exist')
            cy.get('[data-cy=start-date-select]').click()

            cy.get('[data-cy=generate-rpt-btn]')
                .should('exist')
            cy.get('[data-cy=filters-panel]')
                .should('not.exist')
            cy.get('[data-cy=report-table]')
                .should('not.exist')
            cy.get('[data-cy=direct-summary]')
                .should('not.exist')
            cy.get('[data-cy=tray-summary]')
                .should('not.exist')
        })

        it('clicking on end date range hides report', () => {
            cy.get('[data-cy=report-table]').should('exist')
            cy.get('[data-cy=end-date-select]').click()

            cy.get('[data-cy=generate-rpt-btn]')
                .should('exist')
            cy.get('[data-cy=filters-panel]')
                .should('not.exist')
            cy.get('[data-cy=report-table]')
                .should('not.exist')
            cy.get('[data-cy=direct-summary]')
                .should('not.exist')
            cy.get('[data-cy=tray-summary]')
                .should('not.exist')
        })
    })

    context('can see No Logs message at appropriate times', () => {

        it('does not show No Logs message after input with logs', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=no-logs-message]').should('not.exist')
        })

        it('shows No Logs message after input without logs', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2021-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2021-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=no-logs-message]').should('be.visible')
        })
        it('shows No Logs message after input without logs reinput', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2030-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2030-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=no-logs-message]').should('be.visible')
        })
    })

    context('can see summary tables at appropriate times', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
        })

        it('does not immediately display summary tables', () => {
                cy.get('[data-cy=tray-summary]').should('not.exist')
                cy.get('[data-cy=direct-summary]').should('not.exist')
        })

        it('shows summary tables after table is fully loaded', () => {
            cy.get('[data-cy=report-table]').find('tr').its('length').then(length =>{
                expect(length).to.equal(35)
                cy.get('[data-cy=tray-summary]',).should('be.visible')
                cy.get('[data-cy=direct-summary]').should('be.visible')
            }) 
        })
    })

    context('shows message when only one type', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')
            cy.get('[data-cy=start-date-select]')
                .type('2020-05-01')
            cy.get('[data-cy=end-date-select]')
                .type('2020-06-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
        })

        it('show direct seeding message when only tray seeding', () => {
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).should('exist')
                    .select('ENDIVE')
                    .should('have.value', 'ENDIVE')
            })
            cy.get('[data-cy=direct-summary').should('have.text', 'Direct Seeding Summary  There are no Direct Seeding logs with these parameters')
        })

        it('show tray seeding message when only direct seeding', () => {
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).should('exist')
                    .select('CORN-SWEET')
                    .should('have.value', 'CORN-SWEET')
            })
            cy.get('[data-cy=tray-summary').should('have.text', 'Tray Seeding Summary  There are no Tray Seeding logs with these parameters')
        })

        it('show both tables with two types', () => {
            cy.get('[data-cy=direct-summary').should('be.visible')
            cy.get('[data-cy=tray-summary]').should('be.visible')
        })

        it('show one tables with one type', () => {
            cy.get('[data-cy=dropdown-input]').first().select('Direct Seedings').should('have.value', 'Direct Seedings')
            cy.get('[data-cy=direct-summary').should('be.visible')
            cy.get('[data-cy=tray-summary]').should('not.exist')
        })
    })

    context('displays the right information in the table', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
    
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
    
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
                
            cy.get('[data-cy=report-table]').find('tr').its('length')
                .then(length =>{
                    expect(length).to.equal(35)
                })
        })

        it('requests and displays logs that fall between the specified dates', () => {
            let currentTimestamp = null
            const startTimestamp = dayjs('2019-01-01').unix()
            const endTimestamp = dayjs('2019-03-01').unix()

            for(let r = 0; r < 34; r++){
                cy.get('[data-cy=r' + r + 'c0')
                    .invoke('text')
                    .then(dateText => {
                        currentTimestamp = dayjs(dateText).unix()
                        expect(currentTimestamp).is.within(startTimestamp, endTimestamp)
                    })
            }
        })

        it('sorts by type of seeding', () => {
            let typeSeeding = null
            cy.get('[data-cy=seeding-type-dropdown]')
                .should('exist')
            cy.get('[data-cy=dropdown-input]').first()
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')

            for(let r = 0; r < 7; r++){
                cy.get('[data-cy=r' + r + 'c3')
                    .invoke('text')
                    .then(seeding => {
                        typeSeeding = seeding
                        expect(typeSeeding, 'Direct')
                    })
            }

            cy.get('[data-cy=dropdown-input]').first()
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')

            for(let r = 0; r < 27; r++){
                cy.get('[data-cy=r' + r + 'c3')
                    .invoke('text')
                    .then(seeding => {
                        typeSeeding = seeding
                        expect(typeSeeding, 'Tray')
                    })
            }

            cy.get('[data-cy=dropdown-input]').first()
                .select('All')
        })

        it('sorts by crop', () => {
            let crop
            cy.get('[data-cy=crop-dropdown]')
                .should('exist')
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).should('exist')
                    .select('LEEK')
                    .should('have.value', 'LEEK')
            })

            for(let r = 0; r < 3; r++){
                cy.get('[data-cy=r' + r + 'c1')
                    .invoke('text')
                    .then(actualCrop => {
                        crop = actualCrop
                        expect(crop, 'LEEK')
                    })
            }

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1])
                    .select('All')
            })
        })

        it('sorts by field', () => {
            let area
            cy.get('[data-cy=area-dropdown]')
                .should('exist')
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[2]).should('exist')
                    .select('CHUAU')
                    .should('have.value', 'CHUAU')
            })

            for(let r = 0; r < 8; r++){
                cy.get('[data-cy=r' + r + 'c2')
                    .invoke('text')
                    .then(actualArea => {
                        area = actualArea
                        expect(area, 'CHUAU')
                    })
            }
            
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[2])
                    .select('All')
            })
        })
    })

    context('has the correct totals in the seeding summary tables', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('verify all values in the direct seeding summary', () => {
            cy.get('[data-cy=direct-total-rowft]')
            .should('have.text', '26177')

            cy.get('[data-cy=direct-total-bedft]')
            .should('have.text', '8803')

            cy.get('[data-cy=direct-total-hours]')
            .should('have.text', '7')

            cy.get('[data-cy=direct-total-rowft-hour]')
            .should('have.text', '3739.57')

            cy.get('[data-cy=direct-total-bedfr-hour]')
            .should('have.text', '1257.57')
            })

        it('verify all values in the tray seeding summary', () => {
            cy.get('[data-cy=tray-total-seeds]')
            .should('have.text', '16808')
    
            cy.get('[data-cy=tray-total-trays]')
            .should('have.text', '212.5')
    
            cy.get('[data-cy=tray-total-seeds-hour]')
            .should('have.text', '20.1')
    
            cy.get('[data-cy=tray-avg-seeds-hour]')
            .should('have.text', '836.22')
        })
    })

    context('changing the type of seeding changes the visible columns', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')

            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')

            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('displays only columns relevant to both seedings when "All" is selected', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('All')
                .should('have.value', 'All')

            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')

            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')

            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')

            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')

            cy.get('[data-cy=h4]')
                .should('not.exist')

            cy.get('[data-cy=h5]')
                .should('not.exist')

            cy.get('[data-cy=h6]')
                .should('not.exist')

            cy.get('[data-cy=h7]')
                .should('not.exist')

            cy.get('[data-cy=h8]')
                .should('not.exist')

            cy.get('[data-cy=h9]')
                .should('not.exist')

            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')

            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')

            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')

            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')

            cy.get('[data-cy=h14]')
                .should('have.text', 'User')

            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')

            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')
        })

        it('displays columns relevant to direct seedings when "Direct Seedings" is selected', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')

            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')

            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')

            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')

            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')

            cy.get('[data-cy=h4]')
                .should('have.text', 'Row Feet')

            cy.get('[data-cy=h5]')
                .should('have.text', 'Bed Feet')

            cy.get('[data-cy=h6]')
                .should('have.text', 'Rows/Bed')

            cy.get('[data-cy=h7]')
                .should('not.exist')

            cy.get('[data-cy=h8]')
                .should('not.exist')

            cy.get('[data-cy=h9]')
                .should('not.exist')

            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')

            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')

            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')

            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')

            cy.get('[data-cy=h14]')
                .should('have.text', 'User')

            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')

            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')

            cy.get('[data-cy=save-header]')
                .should('not.exist')

            cy.get('[data-cy=cancel-header]')
                .should('not.exist')
        })

        it('displays columns relevant to direct seedings when "Direct Seedings" is selected and in edit mode', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')
            cy.get('[data-cy=edit-button-r0]').first()
                .click()
            
            cy.get('[data-cy=h0]')
                .should('have.text', 'Date')

            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')

            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')

            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')

            cy.get('[data-cy=h4]')
                .should('have.text', 'Row Feet')

            cy.get('[data-cy=h5]')
                .should('have.text', 'Bed Feet')

            cy.get('[data-cy=h6]')
                .should('have.text', 'Rows/Bed')

            cy.get('[data-cy=h7]')
                .should('not.exist')

            cy.get('[data-cy=h8]')
                .should('not.exist')

            cy.get('[data-cy=h9]')
                .should('not.exist')

            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')

            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')

            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')

            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')

            cy.get('[data-cy=h14]')
                .should('have.text', 'User')

            cy.get('[data-cy=edit-header]')
                .should('not.exist')

            cy.get('[data-cy=delete-header]')
                .should('not.exist')

            cy.get('[data-cy=save-header]')
                .should('have.text', 'Save')

            cy.get('[data-cy=cancel-header]')
                .should('have.text', 'Cancel')

            //Force the action to occur because in the viewport isn't big enough for the 
            //button to be clickable
            cy.get('[data-cy=cancel-button-r0]')
                .click({force:true})
        })

        it('displays columns relevant to tray seedings when "Tray Seedings" is selected', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')

                cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')

            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')

            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')

            cy.get('[data-cy=h4]')
                .should('not.exist')

            cy.get('[data-cy=h5]')
                .should('not.exist')

            cy.get('[data-cy=h6]')
                .should('not.exist')

            cy.get('[data-cy=h7]')
                .should('have.text', 'Seeds')

            cy.get('[data-cy=h8]')
                .should('have.text', 'Trays')

            cy.get('[data-cy=h9]')
                .should('have.text', 'Cells/Tray')

            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')

            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')

            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')

            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')

            cy.get('[data-cy=h14]')
                .should('have.text', 'User')

            cy.get('[data-cy=edit-header]')
                .should('have.text', 'Edit')

            cy.get('[data-cy=delete-header]')
                .should('have.text', 'Delete')

            cy.get('[data-cy=save-header]')
                .should('not.exist')

            cy.get('[data-cy=cancel-header]')
                .should('not.exist')
        })

        it('displays columns relevant to tray seedings when "Tray Seedings" is selected and in edit mode', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')
            cy.get('[data-cy=edit-button-r0]').first()
                .click()

            cy.get('[data-cy=h1]')
                .should('have.text', 'Crop')

            cy.get('[data-cy=h2]')
                .should('have.text', 'Area')

            cy.get('[data-cy=h3]')
                .should('have.text', 'Seeding')

            cy.get('[data-cy=h4]')
                .should('not.exist')

            cy.get('[data-cy=h5]')
                .should('not.exist')

            cy.get('[data-cy=h6]')
                .should('not.exist')

            cy.get('[data-cy=h7]')
                .should('have.text', 'Seeds')

            cy.get('[data-cy=h8]')
                .should('have.text', 'Trays')

            cy.get('[data-cy=h9]')
                .should('have.text', 'Cells/Tray')

            cy.get('[data-cy=h10]')
                .should('have.text', 'Workers')

            cy.get('[data-cy=h11]')
                .should('have.text', 'Hours')

            cy.get('[data-cy=h12]')
                .should('have.text', 'Varieties')

            cy.get('[data-cy=h13]')
                .should('have.text', 'Comments')

            cy.get('[data-cy=h14]')
                .should('have.text', 'User')

            cy.get('[data-cy=edit-header]')
                .should('not.exist')

            cy.get('[data-cy=delete-header]')
                .should('not.exist')

            cy.get('[data-cy=save-header]')
                .should('have.text', 'Save')

            cy.get('[data-cy=cancel-header]')
                .should('have.text', 'Cancel')

            //Force the action to occur because in the viewport isn't big enough for the 
            //button to be clickable
            cy.get('[data-cy=cancel-button-r0]')
                .click({force:true})
        })
    })

    context('date picker and filter behavior', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .type('2019-02-13')
            cy.get('[data-cy=end-date-select]')
                .type('2019-02-16')
            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('doesnt display the report when a new date range is being selected', () => {
            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2019-02-13')
            cy.get('[data-cy=date-select]')
                .first()
                .blur()

            cy.get('[data-cy=filters-panel]')
                .should('not.exist')

            cy.get('[data-cy=report-table]')
                .should('not.exist')

            cy.get('[data-cy=direct-summary]')
                .should('not.exist')

            cy.get('[data-cy=tray-summary]')
                .should('not.exist')

            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('updates crop and area options when a new seeding type has been selected', () => {
            cy.get('[data-cy=crop-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'ARUGULA')
                    .next()
                        .should('have.value', 'CARROT')
                    .next()
                        .should('have.value', 'CHARD')
                    .next()
                        .should('have.value', 'ONION-FRESH')
                    .next()
                        .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'A')
                    .next()
                        .should('have.value', 'CHUAU')
                    .next()
                        .should('have.value', 'CHUAU-3')
                    .next()
                        .should('have.value', 'SEEDING BENCH')

            cy.get('[data-cy=seeding-type-dropdown]')
                .children().first().next()
                    .select('Tray Seedings')

            cy.get('[data-cy=crop-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'CHARD')
                    .next()
                        .should('have.value', 'ONION-FRESH')
                    .next()
                        .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'CHUAU')
                    .next()
                        .should('have.value', 'SEEDING BENCH')

            cy.get('[data-cy=seeding-type-dropdown]')
                .children().first().next()
                    .select('All')

        })

        it('updates seeding type and area options when a new crop has been selected', () => {
            cy.get('[data-cy=seeding-type-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'Direct Seedings')
                    .next()
                        .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=area-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'A')
                    .next()
                        .should('have.value', 'CHUAU')
                    .next()
                        .should('have.value', 'CHUAU-3')
                    .next()
                        .should('have.value', 'SEEDING BENCH')

            cy.get('[data-cy=crop-dropdown]')
                .children().first().next()
                    .select('SCALLION')

            cy.get('[data-cy=seeding-type-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=area-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'CHUAU')

            cy.get('[data-cy=crop-dropdown]')
                .children().first().next()
                    .select('All')
        })

        it('updates seeding type and crop options when a new area has been selected', () => {
            cy.get('[data-cy=seeding-type-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'Direct Seedings')
                    .next()
                        .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=crop-dropdown]', )
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'ARUGULA')
                    .next()
                        .should('have.value', 'CARROT')
                    .next()
                        .should('have.value', 'CHARD')
                    .next()
                        .should('have.value', 'ONION-FRESH')
                    .next()
                        .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown]')
                .children().first().next()
                    .select('CHUAU')

            cy.get('[data-cy=seeding-type-dropdown]')
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=crop-dropdown]', )
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'ONION-FRESH')
                    .next()
                        .should('have.value', 'SCALLION')

            cy.get('[data-cy=area-dropdown]')
                .children().first().next()
                    .select('All')
        })

        it('disables the filters while a row is being edited', () => {
            cy.get('[data-cy=edit-button-r0]').first()
                .click()

            cy.get('[data-cy=dropdown-input]').first()
                .should('be.disabled')
        })

        it('filters are no longer disabled when cancel button is clicked', () => {
            cy.get('[data-cy=edit-button-r0]').first()
                .click()
            cy.get('[data-cy=cancel-button-r0]')
                .first()
                .should('exist')
                .click()
            
            cy.get('[data-cy=dropdown-input]').first()
                .should('not.be.disabled')
        })

        it('filters are no longer disabled when save button is clicked', () => {
            cy.get('[data-cy=edit-button-r0]').last()
                .click()

            cy.get('[data-cy=save-button-r0]')
                .first()
                .should('exist')
                .click()
            
            cy.get('[data-cy=dropdown-input]').first()
                .should('not.be.disabled')
        })
    })

    context('edit and delete buttons work', () => {
        let logID = 0

        beforeEach(() => {
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
                        "name": "TEST SEEDING",
                        "type": "farm_seeding",
                        "timestamp": dayjs('2001-09-20').unix(),
                        "done": "1",  //any seeding recorded is done.
                        "notes": {
                            "value": "This is a test log",
                            "format": "farm_format"
                        },
                        "asset": [{ 
                            "id": "1",   //Associated planting
                            "resource": "farm_asset"
                        }],
                        "log_category": [{
                            "id": "240",
                            "resource": "taxonomy_term"
                        }],
                        "movement": {
                            "area": [{
                                "id": "233",
                                "resource": "taxonomy_term"
                            }]
                        },
                        "quantity": [
                            {
                                "measure": "length", 
                                "value": "5",  //total row feet
                                "unit": {
                                    "id": "20", 
                                    "resource": "taxonomy_term"
                                },
                                "label": "Amount planted"
                            },
                            {
                                "measure": "ratio", 
                                "value": "38",
                                "unit": {
                                    "id": "38",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Rows/Bed"
                            },
                            {
                                "measure": "time", 
                                "value": "0.5", 
                                "unit": {
                                    "id": "29",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Labor"
                            },
                            {
                                "measure": "count", 
                                "value": "1", 
                                "unit": {
                                    "id": "15",
                                    "resource": "taxonomy_term"
                                },
                                "label": "Workers"
                            },
                        ],
                        "created": dayjs().unix(),
                        "lot_number": "N/A (No Variety)",
                        "data": "1"
                    }
                }

                cy.request(req).as('create')
                cy.get('@create').should(function(response) {
                    expect(response.status).to.equal(201)
                    logID = response.body.id
                })
            })

            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2001-01-25')

            cy.get('[data-cy=end-date-select]')
                .should('exist')
                .type('2001-12-25')

            cy.get('[data-cy=generate-rpt-btn]').first()
                .click()
        })

        it('edits the database when a row is edited in the table', () => {
            cy.get('[data-cy=edit-button-r0]')
                .click()
            
            cy.get('[data-cy=date-input-r0c0]')
                .type('2001-09-28')
                .blur()    

            cy.get('[data-cy=dropdown-input-r0c1]')
                .first()
                .select('TOMATO')
                .blur()

            cy.get('[data-cy=dropdown-input-r0c2]')
                .first()
                .select('A')
                .blur()

            cy.get('[data-cy=number-input-r0c10]')
                .first()
                .type('4')
                .blur()

            cy.get('[data-cy=number-input-r0c11]')
                .first()
                .type('0.25')
                .blur()

            cy.get('[data-cy=text-input-r0c13]')
                .type('New Comment')
                .blur()

            // Button is actionable, unfortunately it's not in view
            cy.get('[data-cy=save-button-r0]')
                .click({force:true})

            cy.request('/log.json?type=farm_seeding&id=' + logID).as('check')
                cy.get('@check').should(function(response) {
                    expect(response.body.list[0].name).to.equal('TEST SEEDING')
                })

            //use cy.request eventually
            cy.get('[data-cy=delete-button-r0]')
                .click()
        })

        it('deletes a log from the database when the delete button is pressed', () => {
            cy.get('[data-cy=delete-button-r0]')
                .first().click()

            cy.get('[data-cy=object-test]')
                .should('not.exist')
        })
    })
})
