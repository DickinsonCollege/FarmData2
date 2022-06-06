const dayjs = require('dayjs')
var FarmOSAPI = require('../resources/FarmOSAPI.js')

var createRecord = FarmOSAPI.createRecord
var updateRecord = FarmOSAPI.updateRecord
var deleteRecord = FarmOSAPI.deleteRecord
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var getRecord = FarmOSAPI.getRecord
var getSessionToken = FarmOSAPI.getSessionToken

describe('test some api calls in a page', () => {

    let sessionToken = null
    let cropToIDMap = null

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        .then(() => {
            // Once we have logged in, request the session token and
            // cropToIDMap.
            // Using wrap allows us to wait for the asynchronus API request
            // to complete (see cy.get just below).
            cy.wrap(getSessionToken()).as('token')
            cy.wrap(getCropToIDMap()).as('cropMap')
        })
    
        // Wait here for the session token to load in the tests.
        cy.get('@token').should(function(token) {
            sessionToken = token
        })

        // Wait here for the cropToID map to load in the tests.
        cy.get('@cropMap').should(function(map) {
            cropToIDMap = map
        })

        // The tests make use of the CropToIDMap and the session token in the page
        // (e.g. by clicking on buttons that use them.) Thus, we need to be sure 
        // these resources have loaded into the page before the tests continue.
        // These resources are requested in the created() hook in the page's Vue instance.
        // So we setup a wait for the requests that load that content to be completed
        // before going on with the tests.
        // (see: https://docs.cypress.io/guides/guides/network-requests#Waiting)
        cy.intercept('GET', 'taxonomy_term?bundle=farm_crops&page=1').as('cropmap')
        cy.intercept('GET', 'restws/session/token').as('sessiontok')

        cy.visit('/farm/fd2-example/api')
    
        // Wait here for the maps and sesson token to load in the page.
        cy.wait(['@cropmap', '@cropmap', '@sessiontok'])
    })

    context('check farm information', () => {
        it('check farm info is fetched', () => {
            cy.get('[data-cy=farm-name]')
                .should('have.text','')

            cy.get('[data-cy=get-farm-info]').click()

            cy.get('[data-cy=farm-name]')
                .should('have.text','Sample Farm')
        })

        it('check farm info is cleared', () => {
            cy.get('[data-cy=get-farm-info]').click()
            cy.get('[data-cy=farm-name]')
                .should('have.text','Sample Farm')

            cy.get('[data-cy=clear-farm-info]').click()
            cy.get('[data-cy=farm-name]')
                .should('have.text','')
        })
    })

    context('check fetching of a single asset', () => {
        it('check planting asset is fetched', () => {
            cy.get('[data-cy=fetch-planting]').click()

            cy.get('[data-cy=planting-crop]')
                .should('have.text','STRAWBERRY')
            cy.get('[data-cy=planting-asset]')
                .should('contain.text','2017-08-25 STRAWBERRY SQ10')
        })

        it('check planting asset is cleared', () => {
            cy.get('[data-cy=fetch-planting]').click()
            cy.get('[data-cy=planting-crop]')
                .should('have.text','STRAWBERRY')

            cy.get('[data-cy=clear-planting]').click()
            cy.get('[data-cy=planting-crop]')
                .should('have.text','')  
            cy.get('[data-cy=planting-asset]')
                .should('have.text','') 
        })
    })

    context('check fetching of seeding logs', () => {
        it('spot check first/last row of table', () => {
            cy.get('[data-cy=fetch-seedings]').click()

            cy.get('[data-cy=0date]')
                .should('have.text','2020/05/04')
            cy.get('[data-cy=0crop]')
                .should('have.text','POTATO')
            cy.get('[data-cy=0area]')
                .should('have.text','ALF-4')

            cy.get('[data-cy=13date]')
                .should('have.text','2020/05/05')
            cy.get('[data-cy=13crop]')
                .should('have.text','CORN-SWEET')
            cy.get('[data-cy=13area]')
                .should('have.text','ALF-1')
        })

        it('check table is cleared', () => {
            cy.get('[data-cy=fetch-seedings]').click()
            cy.get('[data-cy=13area]')
                .should('have.text','ALF-1')

            cy.get('[data-cy=clear-seedings]').click()
            cy.get('[data-cy=0date]')
                .should('not.exist')
        })
    })

    context('asset ceation/modification/deletion', () => {
        it('new asset is created', () => {
            let plantingID = null
            let url = null

            // Create the asset by clicking the button.
            cy.get('[data-cy=create-planting]').click()
            cy.get('[data-cy=planting-status]')
            .should('have.text', '201')  // 201 = created

            // The assest should have been created, so now request it 
            // from the database to ensure that it was created corectly.
            cy.get('[data-cy=planting-id]')
            .then((id) => {
                plantingID = id.text()
                url = '/farm_asset/' + plantingID
                cy.wrap(getRecord(url)).as('fetch')
            })
            
            // Wait here for the asset to be fetched from the database
            cy.get('@fetch').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success

                // Note a small chance of failure here if running around midnight.
                expect(response.data.name).to.equal(dayjs().format("YYYY-MM-DD") + " BEET  ALF-1")
            })
            .then(() => {
                // We know we have correctly created the asset, so now delete it directly
                // from the database using the deleteRecord function from FarmOSAPI.js
                cy.wrap(deleteRecord(url, sessionToken)).as('delete')
            })

            // Wait here for the record to be deleted and check that it worked.
            cy.get('@delete').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })
        })

        it('asset is updated with new crop', () => {
            let plantingID = null
            let url = null

            // Create the asset by clicking the button.
            cy.get('[data-cy=create-planting]').click()
            cy.get('[data-cy=planting-status]')
            .should('have.text', '201')  // 201 = created

            // Update the asset by clicking the button.
            cy.get('[data-cy=update-planting]').click()
            cy.get('[data-cy=planting-status]')
            .should('have.text', '200')  // 200 - OK/success

            // Get the record to check the update.
            cy.get('[data-cy=planting-id]')
            .then((id) => {
                plantingID = id.text()
                url = '/farm_asset/' + plantingID
                cy.wrap(getRecord(url)).as('fetch')
            })

            // Check that the crop has been changed from BEET to SPINACH
            cy.get('@fetch').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
                expect(response.data.crop[0].id).to.equal(cropToIDMap.get('SPINACH'))
            }) 
            .then(() => {
                // We know we have correctly updated the asset, so now delete it directly
                // from the database using the deleteRecord function from FarmOSAPI.js
                cy.wrap(deleteRecord(url, sessionToken)).as('delete')
            })

            // Wait here for the record to be deleted and check that it worked.
            cy.get('@delete').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })
        })

        it('second update switches toggles crop', () => {
            let plantingID = null
            let url = null
            
            cy.intercept({
                method: '+(POST|PUT)',  // match both the create and the updates.
                url: /.*farm_asset.*/,  // match any route including farm_asset
            })
            .as('asset')
            .then(() => {
                cy.get('[data-cy=create-planting]').click() // create
                cy.get('[data-cy=update-planting]').click() // update to SPINACH
                cy.get('[data-cy=update-planting]').click() // update to BEET
            })

            // Wait here for the create and both updates to complete.
            cy.wait(['@asset', '@asset', '@asset'])

            // Get the record to check the update.
            cy.get('[data-cy=planting-id]')
            .then((id) => {
                plantingID = id.text()
                url = '/farm_asset/' + plantingID
                cy.wrap(getRecord(url)).as('fetch')
            })

            // Check that the crop has been changed from SPINACH back to BEET
            cy.get('@fetch').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
                expect(response.data.crop[0].id).to.equal(cropToIDMap.get('BEET'))
            }) 
            .then(() => {
                // We know we have correctly updated the asset, so now delete it directly
                // from the database using the deleteRecord function from FarmOSAPI.js
                cy.wrap(deleteRecord(url, sessionToken)).as('delete')
            })

            // Wait here for the record to be deleted and check that it worked.
            cy.get('@delete').should((response) => {
                expect(response.status).to.equal(200)  // 200 - OK/success
            })
        })

        it('asset is deleted', () => {
            // Create the asset by clicking the button.
            cy.get('[data-cy=create-planting]').click()
            cy.get('[data-cy=planting-status]')
            .should('have.text', '201')  // 201 = created

            // The assest has been created, so now we can
            // delete it by clicking the button
            cy.get('[data-cy=delete-planting]').click()

            // If succssfully deleted we should get a 200 status.
            cy.get('[data-cy=planting-status]')
            .should('have.text', '200')  // 200 - OK/success
        })
    })
})