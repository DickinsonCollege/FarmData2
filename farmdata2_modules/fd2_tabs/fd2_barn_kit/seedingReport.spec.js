const dayjs = require('dayjs')

describe('Testing for the seeding report page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
    })

    context('sets up the page (necessary for all other tests)', () => {
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

            cy.wait(5000)

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

    context('displays the right information in the table', () => {
        it('requests and displays logs that fall between the specified dates', () => {
            let currentTimestamp = null
            const startTimestamp = dayjs('2019-01-01').unix()
            const endTimestamp = dayjs('2019-03-01').unix()

            cy.wait(5000) //request takes a little while

            cy.get('[data-cy=object-test]')
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

        it('has the correct totals for row feet', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')
            
            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().next().next().then(($rowFeet) => {
                        totalRowFeet = totalRowFeet + parseInt($rowFeet[0].innerText);
                    })
                })
                .then(() => {
                    cy.get('[data-cy=direct-summary]')
                        .children().first().next().next().children()
                        .should('have.text', totalRowFeet.toString())
                })
        })

        it('has the correct totals for bed feet', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')
            
            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().next().next().next().then(($bedFeet) => {
                        totalBedFeet = totalBedFeet + parseInt($bedFeet[0].innerText);
                    })
                })
                .then(() => {
                    cy.get('[data-cy=direct-summary]')
                        .children().first().next().next().next().children()
                        .should('have.text', totalBedFeet.toString())
                })
        })

        it('has the correct totals for bed feet', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Direct Seedings')
                .should('have.value', 'Direct Seedings')
            
            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().next().next().next().next().then(($hoursWorked) => {
                        totalHoursWorked = totalHoursWorked + parseFloat($hoursWorked[0].innerText);
                    })
                })
                .then(() => {
                    cy.get('[data-cy=direct-summary]')
                        .children().first().next().next().next().next().children()
                        .should('have.text', totalHoursWorked.toString())
                })
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

        it('has the correct total number of seeds', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')
            
            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().next().then(($numSeeds) => {
                        totalSeeds = totalSeeds + parseFloat($numSeeds[0].innerText);
                    })
                })
                .then(() => {
                    cy.get('[data-cy=tray-summary]')
                        .children().first().next().children()
                        .should('have.text', totalSeeds.toString())
                })
        })

        it('has the correct total number of trays', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')
            
            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().next().next().then(($numTrays) => {
                        totalTrays = totalTrays + parseFloat($numTrays[0].innerText);
                    })
                })
                .then(() => {
                    cy.get('[data-cy=tray-summary]')
                        .children().first().next().next().children()
                        .should('have.text', totalTrays.toString())
                })
        })

        it('has the correct total number of hours worked', () => {
            cy.get('[data-cy=dropdown-input]').first()
                .select('Tray Seedings')
                .should('have.value', 'Tray Seedings')
            
            cy.get('[data-cy=object-test]')
                .each(($el, index, $all) => {
                    cy.get($el).children()
                    .first().next().next().next().next().next().next().next().then(($numHours) => {
                        totalHoursWorked = totalHoursWorked + parseFloat($numHours[0].innerText);
                    })
                })
                .then(() => {
                    totalHoursWorked = Math.round((totalHoursWorked)*100)/100

                    cy.get('[data-cy=tray-summary]')
                        .children().first().next().next().next().children()
                        .should('have.text', totalHoursWorked.toString())
                })
        })

        it('has the correct average seeds planted per hour', () => {
            let avgSeedsPerHour = Math.round((totalSeeds/totalHoursWorked)*100)/100

            cy.get('[data-cy=tray-summary]')
                .children().first().next().next().next().next().children()
                .should('have.text', avgSeedsPerHour.toString())
        })
    })
})