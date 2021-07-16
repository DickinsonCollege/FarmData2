const dayjs = require('dayjs')
var FarmOSAPI = require("./../resources/FarmOSAPI.js")
var getSessionToken = FarmOSAPI.getSessionToken
var createRecord = FarmOSAPI.createRecord
var deleteRecord = FarmOSAPI.deleteRecord

describe('Testing for the seeding report page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
    })

    context.only('sets up the page (necessary for all other tests)', () => {
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

    context('changing the type of seeding changes the visible columns', () => {
        it('displays only columns relevant to both seedings when "All" is selected', () => {
            cy.get('[data-cy=dropdown-input]').first()
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
            cy.get('[data-cy=dropdown-input]').first()
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
            cy.get('[data-cy=dropdown-input]').first()
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
        it('doesnt display the report when a new date range is being selected', () => {
            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2019-01-02')
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

        it('disables the filters while a row is being edited', () => {
            cy.get('[data-cy=edit-button]').first()
                .click()

            cy.get('[data-cy=dropdown-input]').first()
                .should('be.disabled')
        })
    })

    context.only('edit and delete buttons work', () => {
        let logID = 0

        beforeEach(() => {
            cy.visit('/farm/fd2-barn-kit/seedingReport')

            cy.get('[data-cy=start-date-select]')
                .should('exist')
                .type('2001-01-25')

            cy.get('[data-cy=end-date-select]')
                .should('exist')
                .type('2001-12-25')

            cy.get('[data-cy=generate-rpt-btn]').first()
                .click()

            cy.wait(15000)
        })

        it('displays a log that has just been created', () => {
            
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

            cy.wait(15000)

            cy.get('[data-cy=object-test]')
                .first().children()
                    .first().then(($date) => {
                        expect($date[0].innerText).to.equal("2001-09-20")
                    })
                    .next().then(($crop) => {
                        expect($crop[0].innerText).to.equal('')
                    })
                    .next().then(($area) => {
                        expect($area[0].innerText).to.equal('TEACHING')
                    })
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
        })

        it('deletes a log from the database when the delete button is pressed', () => {
            cy.get('[data-cy=delete-button]')
                .first().click()

            cy.get('[data-cy=object-test]')
                .should('not.exist')
        })
    })
})