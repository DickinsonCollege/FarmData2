const dayjs = require('dayjs')

describe('Test the UI component', () => {

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-example/ui')
    })     

    context('check the dropdown with all component', () => {
        it('check initial value', () => {
            cy.get('[data-cy=picked-crop]').should('have.text','All')
        })

        it('check item selection event handler', () => {
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
            .select("WATERMELLON")
            cy.get('[data-cy=picked-crop]').should('have.text','WATERMELLON')
        })

        it('programatically set selected item', () => {
            cy.get('[data-cy=choose-kale]').click()
            cy.get('[data-cy=picked-crop]').should('have.text','KALE')
        })

        it('modify the list of choices', () => {
            cy.get('[data-cy=add-zucchini]').click()
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]')
            .select("ZUCCHINI")
            cy.get('[data-cy=picked-crop]').should('have.text','ZUCCHINI')
        })

        it('disable and enable the dropdown', () => {
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('not.be.disabled')
            cy.get('[data-cy=btn-dropdown-disable]').click()
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('be.disabled')
            cy.get('[data-cy=btn-dropdown-enable]').click()
            cy.get('[data-cy=crop-dropdown] > [data-cy=dropdown-input]').should('not.be.disabled')
        })
    })

    context('check the regex input with all component', () => {
        it('check initial value', () => {
            cy.get('[data-cy=inputed-val]').should('have.text', '')
            cy.get('[data-cy=match-val]').should('have.text', 'false')
        })

        it('enter an invalid value into the input box', () => {
            cy.get('[data-cy=regex-input] > [data-cy=text-input]')
            .type("WATERMELLON")
            .blur()
            cy.get('[data-cy=inputed-val]').should('have.text', '')
            cy.get('[data-cy=match-val]').should('have.text', 'false')
        })

        it('click the button for positive decimals and test positive results', () => {
            cy.get('[data-cy=choose-positive-decimals]').click()
            cy.get('[data-cy=regex-input] > [data-cy=text-input]')
            .clear()
            .type("10.5")
            .blur()
            cy.get('[data-cy=inputed-val]').should('have.text', '10.5')
            cy.get('[data-cy=match-val]').should('have.text', 'true')

        })

        it('click the button for positive decimals and test negative results', () => {
            cy.get('[data-cy=regex-input] > [data-cy=text-input]')
            .clear()
            .type("LEMONS")
            .blur()
            cy.get('[data-cy=inputed-val]').should('have.text', '')
            cy.get('[data-cy=match-val]').should('have.text', 'false')
        })

        it('click the button for positive ints and test positive results', () => {
            cy.get('[data-cy=choose-positive-ints]').click()
            cy.get('[data-cy=regex-input] > [data-cy=text-input]')
            .clear()
            .type("10")
            .blur()
            cy.get('[data-cy=inputed-val]').should('have.text', '10')
            cy.get('[data-cy=match-val]').should('have.text', 'true')

        })

        it('click the button for positive reals and test negative results', () => {
            cy.get('[data-cy=regex-input] > [data-cy=text-input]')
            .clear()
            .type("10.5")
            .blur()
            cy.get('[data-cy=inputed-val]').should('have.text', '10.5')
            cy.get('[data-cy=match-val]').should('have.text', 'false')
        })

        it('click reset button and check val in input box', () => {
            cy.get('[data-cy=reset-input-val]').click()
            cy.get('[data-cy=inputed-val]').should('have.text', '0')
            cy.get('[data-cy=match-val]').should('have.text', 'false')
        })

        it('disable and enable the input', () => {
            cy.get('[data-cy=regex-input] > [data-cy=text-input]').should('not.be.disabled')
            cy.get('[data-cy=btn-input-disable]').click()
            cy.get('[data-cy=regex-input] > [data-cy=text-input]').should('be.disabled')
            cy.get('[data-cy=btn-input-enable]').click()
            cy.get('[data-cy=regex-input]').should('not.be.disabled')
        })
    })

    context('check the date input component', () => {

        it('test click event handler', () => {
            cy.get('[data-cy=date-clicks]').should('have.text','0')

            // Need to get the element with data-cy=date-select that is
            // inside of the component with data-cy=date-picker. 
            cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()

            cy.get('[data-cy=date-clicks]').should('have.text','1')
            cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-clicks]').should('have.text', '2')
            cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-clicks]').should('have.text', '3')
        })

        it('test date change event handler', () => {
            cy.get('[data-cy=date-picker] > [data-cy=date-select]')
            .type('2021-01-22')  // note the format for typing.
            .blur() // makes component inactive which triggers the date-change event.

            cy.get('[data-cy=date-chosen]').should('have.text', '2021-01-22')
        })

        it('disable and enable the date selection component', () => {
            cy.get('[data-cy=date-select]').should('not.be.disabled')
            cy.get('[data-cy=btn-date-disable]').click()
            cy.get('[data-cy=date-select]').should('be.disabled')
            cy.get('[data-cy=btn-date-enable]').click()
            cy.get('[data-cy=date-select]').should('not.be.disabled')
        })
    })

    context('check the date range component', () => {

        it('test click event handler', () => {
            cy.get('[data-cy=date-range-clicks').should('have.text','0')

            // Need to get the date-select element that is inside the start-date-select element.
            // Note: We do not need to specify the full path to the element, just need to 
            // disambiguate them.
            cy.get('[data-cy=start-date-select] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-range-clicks]').should('have.text','1')

            cy.get('[data-cy=end-date-select] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-picker] > [data-cy=date-select]').click()
            cy.get('[data-cy=date-range-clicks]').should('have.text', '2')
        })

        it('check default end date', () => {
            cy.get('[data-cy=end-date-select] > [data-cy=date-select]')
            .should('have.value',dayjs().format("YYYY-MM-DD"))
        })

        it('test start date change event handler', () => {
            cy.get('[data-cy=start-date-select] > [data-cy=date-select]')
            .type('2021-01-22')  
            .blur()

            cy.get('[data-cy=start-date]').should('have.text', '2021-01-22')
        })

        it ('test end date change event handler', () => {
            cy.get('[data-cy=end-date-select] > [data-cy=date-select]')
            .type('2021-01-23')  
            .blur()

            cy.get('[data-cy=end-date]').should('have.text', '2021-01-23')
        })
        it('disable and enable the date range component', () => {
            cy.get('[data-cy=start-date-select] > [data-cy=date-select]').should('not.be.disabled')
            cy.get('[data-cy=end-date-select] > [data-cy=date-select]').should('not.be.disabled')
            cy.get('[data-cy=btn-daterange-disable]').click()
            cy.get('[data-cy=start-date-select] > [data-cy=date-select]').should('be.disabled')
            cy.get('[data-cy=end-date-select] > [data-cy=date-select]').should('be.disabled')
            cy.get('[data-cy=btn-daterange-enable]').click()
            cy.get('[data-cy=start-date-select] > [data-cy=date-select]').should('not.be.disabled')
            cy.get('[data-cy=end-date-select] > [data-cy=date-select]').should('not.be.disabled')
        })
     })

    context('check the sample buttons', () => {

        it('check initial button state', () => {
            cy.get('[data-cy=left-button]')
                .should('not.be.disabled')
            cy.get('[data-cy=right-button]')
                .should('be.disabled')
        })

        it('clicking buttons toggles state', () => {
            cy.get('[data-cy=left-button]')
                .click()
            cy.get('[data-cy=left-button]')
                .should('be.disabled')
            cy.get('[data-cy=right-button]')
                .should('not.be.disabled')

            cy.get('[data-cy=right-button]')
                .click()
            cy.get('[data-cy=left-button]')
                .should('not.be.disabled')
            cy.get('[data-cy=right-button]')
                .should('be.disabled')    
        })
    })

    context('check the table component', () => {

        it('table data is loaded', () => {
            cy.get('[data-cy=r0c0]')
                .should('have.text', '1')
            cy.get('[data-cy=r1c1]')
                .should('have.text', 'Pants')

            // Note: There is a hidden column are counted - so r2c5
            cy.get('[data-cy=r2c5]')
                .should('have.text', '2020-03-01')
        })

        it('table row is deleted', () => {
            cy.get('[data-cy=r1c0]')
                .should('have.text', '5')

            cy.get('[data-cy=delete-button-r1')
                .click()
            
            cy.get('[data-cy=r1c0]')
                .should('have.text', '9')
        })

        it('table row is edited', () => {
            cy.get('[data-cy=edit-button-r1')
                .click()

            cy.get('[data-cy=text-input-r1c1')
                .clear()
                .type('Tee Shirts')
            
            cy.get('[data-cy=save-button-r1]')
                .click()

            cy.on("window:confirm", () => true)
            
            cy.get('[data-cy=r1c1]')
                .should('have.text','Tee Shirts')
        })

        it('table row is added', () => {
            cy.get('[data-cy=add-data')
                .click()
            
            cy.get('[data-cy=r3c0]')
                .should('have.text', '12')
        })

        it('size column shows when show column is clicked, hides when hide column is clicked', () => {
            cy.get('[data-cy=table-headers]').children()
                .should('not.contain', 'Size')
            cy.get('[data-cy=show-column')
                .click()
            cy.get('[data-cy=table-headers]').children()
                .should('contain', 'Size')
            cy.get('[data-cy=hide-column')
                .click()
            cy.get('[data-cy=table-headers]').children()
                .should('not.contain', 'Size')
        })
    })

    context('check the spinner example', () => {

        it('spinner appears while loading', () => {
            cy.get('[data-cy=loading-spinner]')
                .should('not.exist')

            cy.get('[data-cy=fetch-seeding-logs]')
                .click()

            cy.get('[data-cy=loading-spinner]')
                .should('exist')
            cy.get('[data-cy=first-log-name]')
                .should('have.text','2019-02-04 RADISH CHUAU-2')
            cy.get('[data-cy=loading-spinner]')
                .should('exist')
            cy.get('[data-cy=last-log-name]')
                .should('have.text','2019-03-25 PEPPERS-BELL')
            cy.get('[data-cy=loading-spinner]')
                .should('exist')
            cy.get('[data-cy=last-log-name]')
                .should('have.text','2019-04-26 LEEK')
                
            cy.get('[data-cy=loading-spinner]')
                .should('not.exist')
        })
    })

    context('check the api error handler example', () => {

        it('forefully trigger an error code not within 2xx', () => {
            cy.get('[data-cy=alert-err-handler]')
                .should('not.visible')
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
                
            cy.intercept('GET', '/farm/fd2-example/abc',{ statusCode: 500 })
                .as('getServerFailure')
            
            cy.get('[data-cy=fetch-err-api]')
                .click()
            cy.wait('@getServerFailure')

            cy.get('[data-cy=alert-err-handler]')
                .should('be.visible')
            cy.get('[data-cy=first-log-name]')
                .should('have.text','')
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
            cy.get('[data-cy=last-log-name]')
                .should('have.text','')
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
            cy.get('[data-cy=last-log-name]')
                .should('have.text','')
        
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')

            cy.get('[data-cy=alert-err-handler]')
                .should('be.visible')
                .click()
                .should('not.visible')
        })

        it('forefully trigger a network failure error', () => {
            cy.get('[data-cy=alert-err-handler]')
                .should('not.visible')
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
            
            cy.intercept('GET', '/farm/fd2-example/abc', { forceNetworkError: true })
                .as('getNetworkFailure')
            
            cy.get('[data-cy=fetch-err-api]')
                .click()
            cy.wait('@getNetworkFailure')
        
            cy.get('[data-cy=alert-err-handler]')
                .should('be.visible')
            cy.get('[data-cy=first-log-name]')
                .should('have.text','')
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
            cy.get('[data-cy=last-log-name]')
                .should('have.text','')
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
            cy.get('[data-cy=last-log-name]')
                .should('have.text','')
        
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
    
            cy.get('[data-cy=alert-err-handler]')
                .should('be.visible')
                .click()
                .should('not.visible')
        })

        it('something happened while setting up the request that triggered an error', () => {
            cy.get('[data-cy=alert-err-handler]')
                .should('not.visible')
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
            
            cy.get('[data-cy=fetch-err-api]')
                .click()
        
            cy.get('[data-cy=alert-err-handler]')
                .should('be.visible')
            cy.get('[data-cy=first-log-name]')
                .should('have.text','')
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
            cy.get('[data-cy=last-log-name]')
                .should('have.text','')
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
            cy.get('[data-cy=last-log-name]')
                .should('have.text','')
        
            cy.get('[data-cy=loading-err-spinner]')
                .should('not.exist')
    
            cy.get('[data-cy=alert-err-handler]')
                .should('be.visible')
                .click()
                .should('not.visible')
        })
    })
})
