const dayjs = require('dayjs')
var FarmOSAPI = require("./../resources/FarmOSAPI.js")
var getSessionToken = FarmOSAPI.getSessionToken
var createRecord = FarmOSAPI.createRecord
var deleteRecord = FarmOSAPI.deleteRecord

describe('Testing for the seeding report page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
    })

    context('can set dates and then render the report', () => {
        it('visits the page and logs in', () => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')
        })

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

            cy.get('[data-cy=filters-panel]', { timeout: 10000 })
                .should('exist')

            cy.get('[data-cy=report-table]')
                .should('exist')

            cy.get('[data-cy=direct-summary]')
                .should('exist')

            cy.get('[data-cy=tray-summary]')
                .should('exist')
        })

        
    })
    context('can see spinner at appropriate times', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')

        })

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
            cy.get('[data-cy=report-table]', { timeout: 20000 }).find('tr').its('length').then(length =>{
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

        context('can see No Logs message at appropriate times', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')

        })

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
            cy.get('[data-cy=no-logs-message]', {timeout: 30000}).should('be.visible')
        })
        it('shows No Logs message after input without logs reinput', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2030-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2030-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
            cy.get('[data-cy=no-logs-message]', {timeout: 30000}).should('be.visible')
        })
    })
    context('can see summary tables at appropriate times', () => {
        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')


        })
        it('does not immediately display summary tables', () => {
            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')
            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')
            cy.get('[data-cy=generate-rpt-btn]').click()
                cy.get('[data-cy=tray-summary]').should('not.exist')
                cy.get('[data-cy=direct-summary]').should('not.exist')
        })
        it('shows summary tables after table is fully loaded', () => {

            cy.get('[data-cy=report-table]', { timeout: 30000 }).find('tr').its('length').then(length =>{
                expect(length).to.equal(35)
                cy.get('[data-cy=tray-summary]',{ timeout: 30000 }).should('be.visible')
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
            cy.get('[data-cy=dropdown-input]', {timeout: 30000}).then(($dropdowns) => {
                cy.get($dropdowns[1]).should('exist')
                    .select('ENDIVE')
                    .should('have.value', 'ENDIVE')
            })
            cy.get('[data-cy=direct-summary').should('have.text', 'Direct Seeding Summary  There are no Direct Seeding logs with these parameters')
        })

        it('show tray seeding message when only direct seeding', () => {
            cy.get('[data-cy=dropdown-input]', {timeout: 30000}).then(($dropdowns) => {
                cy.get($dropdowns[1]).should('exist')
                    .select('CORN-SWEET')
                    .should('have.value', 'CORN-SWEET')
            })
            cy.get('[data-cy=tray-summary').should('have.text', 'Tray Seeding Summary  There are no Tray Seeding logs with these parameters')
        })

        it('show both tables with two types', () => {
            cy.get('[data-cy=direct-summary', {timeout: 30000}).should('be.visible')
            cy.get('[data-cy=tray-summary]').should('be.visible')

        })

        it('show one tables with one type', () => {
            cy.get('[data-cy=dropdown-input]', {timeout: 30000}).first().select('Direct Seedings').should('have.value', 'Direct Seedings')
            cy.get('[data-cy=direct-summary').should('be.visible')
            cy.get('[data-cy=tray-summary]').should('not.exist')

        })

    })

    context('displays the right information in the table', () => {
        before(() => {
            cy.login('manager1', 'farmdata2')
            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')

            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')

            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })
        it('requests and displays logs that fall between the specified dates', () => {
            let currentTimestamp = null
            const startTimestamp = dayjs('2019-01-01').unix()
            const endTimestamp = dayjs('2019-03-01').unix()

            cy.get('[data-cy=object-test]', { timeout: 10000 })
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().then(($date) => {
                        currentTimestamp = dayjs($date[0].innerText).unix()
                    })
                    .then(() => {
                        expect(currentTimestamp).is.within(startTimestamp, endTimestamp)
                    })
                })
        })

        it('sorts by type of seeding', () => {
            cy.get('[data-cy=seeding-type-dropdown]')
                .should('exist')
            cy.get('[data-cy=dropdown-input]').first()
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')

            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().then(($seeding) => {
                        expect($seeding[0].innerText).to.equal('Direct Seedings')
                    })
                })

            cy.get('[data-cy=dropdown-input]').first()
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().then(($seeding) => {
                        expect($seeding[0].innerText).to.equal('Tray Seedings')
                    })
                })
            
            cy.get('[data-cy=dropdown-input]').first()
                .select('All')
        })

        it('sorts by crop', () => {
            cy.get('[data-cy=crop-dropdown]')
                .should('exist')
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1]).should('exist')
                    .select('LEEK')
                    .should('have.value', 'LEEK')
            })

            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().then(($crop) => {
                        expect($crop[0].innerText).to.equal('LEEK')
                    })
                })

            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[1])
                    .select('All')
            })
        })

        it('sorts by field', () => {
            cy.get('[data-cy=area-dropdown]')
                .should('exist')
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[2]).should('exist')
                    .select('CHUAU')
                    .should('have.value', 'CHUAU')
            })

            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().then(($crop) => {
                        expect($crop[0].innerText).to.equal('CHUAU')
                    })
                })
            
            cy.get('[data-cy=dropdown-input]').then(($dropdowns) => {
                cy.get($dropdowns[2])
                    .select('All')
            })
        })
    })

    context('has the correct totals in the direct seeding summary', () => {
        let totalRowFeet = 0;
        let totalBedFeet = 0;
        let totalHoursWorked = 0;

        before(() => {
            cy.login('manager1', 'farmdata2')
            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')

            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')

            cy.get('[data-cy=generate-rpt-btn]')
                .click()

            cy.get('[data-cy=dropdown-input]', {timeout: 10000}).first()
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')
            
            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().next().next().then(($rowFeet) => {
                        totalRowFeet = totalRowFeet + parseInt($rowFeet[0].innerText);
                    })
                    .next().then(($bedFeet) => {
                        totalBedFeet = totalBedFeet + parseInt($bedFeet[0].innerText);
                    })
                    .next().then(($hoursWorked) => {
                        totalHoursWorked = totalHoursWorked + parseFloat($hoursWorked[0].innerText);
                    })
                })
        })

        it('has the correct totals for row feet', () => {
            cy.get('[data-cy=direct-summary]')
                .children().first().next().next().children()
                .should('have.text', totalRowFeet.toString())
        })

        it('has the correct totals for bed feet', () => {
            cy.get('[data-cy=direct-summary]')
                .children().first().next().next().next().children()
                .should('have.text', totalBedFeet.toString())
        })

        it('has the correct totals for bed feet', () => {
            cy.get('[data-cy=direct-summary]')
                .children().first().next().next().next().next().children()
                .should('have.text', totalHoursWorked.toString())
        })

        it('has the correct bed feet per hour', () => {
            let bedFeetPerHour = (Math.round((totalBedFeet/totalHoursWorked)*100))/100

            cy.get('[data-cy=direct-summary]')
                .children().first().next().next().next().next().next().children()
                .should('have.text', bedFeetPerHour.toString())
        })

        it('has the correct row feet per hour', () => {
            let rowFeetPerHour = (Math.round((totalRowFeet/totalHoursWorked)*100))/100

            cy.get('[data-cy=direct-summary]')
                .children().first().next().next().next().next().next().next().children()
                .should('have.text', rowFeetPerHour.toString())
        })
    })

    context('has the correct totals in the tray seeding summary', () => {
        let totalSeeds = 0
        let totalTrays = 0
        let totalHoursWorked = 0

        before(() => {
            cy.login('manager1', 'farmdata2')
            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')

            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')

            cy.get('[data-cy=generate-rpt-btn]')
                .click()

            cy.get('[data-cy=dropdown-input]', {timeout: 10000}).first()
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')
            
            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().next().then(($numSeeds) => {
                        totalSeeds = totalSeeds + parseFloat($numSeeds[0].innerText);
                    })
                    .next().then(($numTrays) => {
                        totalTrays = totalTrays + parseFloat($numTrays[0].innerText);
                    })
                    .next().next().then(($numHours) => {
                        totalHoursWorked = totalHoursWorked + parseFloat($numHours[0].innerText);
                    })
                })
        })

        it('has the correct total number of seeds', () => {
            cy.get('[data-cy=tray-summary]')
                .children().first().next().children()
                .should('have.text', totalSeeds.toString())
        })

        it('has the correct total number of trays', () => {
            cy.get('[data-cy=tray-summary]')
                .children().first().next().next().children()
                .should('have.text', totalTrays.toString())
        })

        it('has the correct total number of hours worked', () => {
            totalHoursWorked = Math.round((totalHoursWorked)*100)/100

            cy.get('[data-cy=tray-summary]')
                .children().first().next().next().next().children()
                .should('have.text', totalHoursWorked.toString())
        })

        it('has the correct average seeds planted per hour', () => {
            let avgSeedsPerHour = Math.round((totalSeeds/totalHoursWorked)*100)/100

            cy.get('[data-cy=tray-summary]', {timeout: 10000})
                .children().first().next().next().next().next().children()
                .should('have.text', avgSeedsPerHour.toString())
        })
    })

    context('changing the type of seeding changes the visible columns', () => {
        before(() => {
            cy.login('manager1', 'farmdata2')
            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .type('2019-01-01')

            cy.get('[data-cy=end-date-select]')
                .type('2019-03-01')

            cy.get('[data-cy=generate-rpt-btn]')
                .click()
        })

        it('displays only columns relevant to both seedings when "All" is selected', () => {
            cy.get('[data-cy=dropdown-input]', {timeout: 10000}).first()
                .select('All')
                .should('have.value', 'All')

            cy.get('[data-cy=headers]')
                .first().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('date')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('crop')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('area')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Tray/Direct')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Hours')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Num Workers')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Varieties')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Comments')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('User')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Edit')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Delete')
                })
        })

        it('displays columns relevant to direct seedings when "Direct Seedings" is selected', () => {
            cy.get('[data-cy=dropdown-input]', {timeout: 10000}).first()
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')

            cy.get('[data-cy=headers]')
                .first().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('date')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('crop')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('area')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Tray/Direct')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Row/Bed')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Row Feet')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Bed Feet')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Hours')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Num Workers')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Varieties')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Comments')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('User')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Edit')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Delete')
                })
        })

        it('displays columns relevant to tray seedings when "Tray Seedings" is selected', () => {
            cy.get('[data-cy=dropdown-input]', {timeout: 10000}).first()
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')

            cy.get('[data-cy=headers]')
                .first().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('date')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('crop')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('area')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Tray/Direct')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Tray Seeds')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('# of Trays')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Cells Per Tray')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Hours')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Num Workers')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Varieties')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Comments')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('User')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Edit')
                })
                .next().then(($headerVal) => {
                    expect($headerVal[0].innerText).to.equal('Delete')
                })
        })
    })

    context('date picker and filter behavior', () => {
        before(() => {
            cy.login('manager1', 'farmdata2')
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
            cy.get('[data-cy=crop-dropdown]', {timeout: 10000})
                .children().first().next().children()
                    .first()
                        .should('have.value', 'All')
                    .next()
                        .should('have.value', 'ARUGULA', {timeout: 10000})
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
            cy.get('[data-cy=seeding-type-dropdown]', {timeout: 10000})
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
            cy.get('[data-cy=seeding-type-dropdown]', {timeout: 10000})
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
                        .should('have.value', 'ARUGULA', {timeout: 10000})
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
            cy.get('[data-cy=edit-button]', {timeout: 10000}).first()
                .click()

            cy.get('[data-cy=dropdown-input]').first()
                .should('be.disabled')
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
            cy.get('[data-cy=edit-button]')
                .first().click()

            cy.get('[data-cy=number-input]')
                .first()
                .type('15')
                .blur()

            cy.get('[data-cy=date-input]')
                .type('2001-09-28')
                .blur()

            cy.get('[data-cy=test-input]')
                .type('New Comment')
                .blur()

            cy.get('[data-cy=dropdown-table-input]')
                .first()
                .select('TOMATO')
                .blur()

            cy.get('[data-cy=save-button]')
                .first().click()

            cy.request('/log.json?type=farm_seeding&id=' + logID).as('check')
                cy.get('@check').should(function(response) {
                    expect(response.body.list[0].name).to.equal('TEST SEEDING')
                })

            //use cy.request eventually
            cy.get('[data-cy=delete-button]')
                .first().click()
        })

        it('deletes a log from the database when the delete button is pressed', () => {
            cy.get('[data-cy=delete-button]')
                .first().click()

            cy.get('[data-cy=object-test]')
                .should('not.exist')
        })
    })
})