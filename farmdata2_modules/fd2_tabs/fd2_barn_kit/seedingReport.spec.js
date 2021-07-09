const dayjs = require('dayjs')

describe('Testing for the seeding report page', () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
    })
    
    it.only('visits the page and logs in', () => {
        cy.visit('/farm/fd2-barn-kit/seedingReport')
    })

    it.only('allows user input of the start and end dates', () => {
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

    it.only('generate report button renders the rest of the page', () => {
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

    it.only('sorts by crop', () => {
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

    it.only('sorts by field', () => {
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