/**
 * The Creating/Updating/Deleting an Asset section of the API subtab
 * illustrates how to make now assets, modify the contents of an existing
 * asset and delete an asset.  This spec will test each of those 
 * functionalities.
 */

const dayjs = require('dayjs')

var FarmOSAPI = require('../../resources/FarmOSAPI.js')
var deleteRecord = FarmOSAPI.deleteRecord
var getCropToIDMap = FarmOSAPI.getCropToIDMap
var getRecord = FarmOSAPI.getRecord
var getSessionToken = FarmOSAPI.getSessionToken

describe('Test creation/modification/deletion of assets.', () => {

    let sessionToken = null
    let cropToIDMap = null

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        .then(() => {
            // The session token is required for create/modify/delete operations.
            cy.wrap(getSessionToken()).as('token')
            // The cropToIDMap is used to get crop ID's from crop names in some tests.
            cy.wrap(getCropToIDMap()).as('cropMap')
        })
    
        // We requested the session token and cropToIDMap, but we need to wait
        // for the API responses with the data before we can use them.
        cy.get('@token').then(function(token) {
            sessionToken = token
        })
        cy.get('@cropMap').then(function(map) {
            cropToIDMap = map
        })

        cy.visit('/farm/fd2-example/api')

        // The page uses a session token, cropToIDMap and IDToCropMap, so
        // we need to wait for those to be loaded into the page before 
        // we continue with the tests.
        cy.waitForPage()
    })

    it('Click Make Asset button and check that asset is created in database.', () => {
        let plantingID = null
        let url = null

        // Create the asset by clicking the button.
        cy.get('[data-cy=create-planting]').click()
        // Note: Status will not be set until after API response is received
        // So this effectively waits for the asset to be created in the db.
        cy.get('[data-cy=planting-status]')
            .should('have.text', '201')  // 201 = created

        // The asset should have been created, so now request it
        // from the database to ensure that it was created correctly.
        cy.get('[data-cy=planting-id]')
        .then((id) => {
            plantingID = id.text()
            url = '/farm_asset/' + plantingID
            cy.wrap(getRecord(url)).as('fetch')
        })
        
        // Wait here for the asset to be fetched from the database
        cy.get('@fetch').then((response) => {
            expect(response.status).to.equal(200)  // 200 = OK/success

            // Check that the 
            // Note a small chance of failure here if running around midnight.
            expect(response.data.name).to.equal(dayjs().format("YYYY-MM-DD") + " BEET  ALF-1")

            // We know we have correctly created the asset, so now delete it directly
            // from the database using the deleteRecord function from FarmOSAPI.js
            cy.wrap(deleteRecord(url, sessionToken)).as('delete')
        })

        // Wait here for the record to be deleted and check that it worked.
        cy.get('@delete').then((response) => {
            expect(response.status).to.equal(200)  // 200 - OK/success
        })
    })

    it('Click Update Asset and check that crop has been changed to BEET in database.', () => {
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

        // Wait for the record to be retrieved and then check that 
        // the crop has been changed from BEET to SPINACH
        cy.get('@fetch').then((response) => {
            expect(response.status).to.equal(200)  // 200 - OK/success
            expect(response.data.crop[0].id).to.equal(cropToIDMap.get('SPINACH'))

            // We know we have correctly updated the asset, so now delete it directly
            // from the database using the deleteRecord function from FarmOSAPI.js
            cy.wrap(deleteRecord(url, sessionToken)).as('delete')
        })

        // Wait here for the record to be deleted and check that it worked.
        cy.get('@delete').then((response) => {
            expect(response.status).to.equal(200)  // 200 - OK/success
        })
    })

    it('Click Update Asset again, and check that crop is toggled back to SPINACH in db.', () => {
        let plantingID = null
        let url = null
        
        // Create intercepts so that we can know when the API calls made by the
        // page have completed.  Once they have completed then we can check the
        // database.
        cy.intercept({
            method: '+(POST|PUT)',  // match both create and the updates.
            url: /.*farm_asset.*/,  // match any route including farm_asset.
            times: 3,               // match this route at most 3 times.
        })
        .as('asset')
        .then(() => {
            cy.get('[data-cy=create-planting]').click() // create asset
            cy.get('[data-cy=update-planting]').click() // update to SPINACH
            cy.get('[data-cy=update-planting]').click() // update to BEET
        })

        // Wait here for create and both updates to complete.
        cy.wait(['@asset', '@asset', '@asset'])

        // Get the record to check the update.
        cy.get('[data-cy=planting-id]').then((id) => {
            plantingID = id.text()
            url = '/farm_asset/' + plantingID
            cy.wrap(getRecord(url)).as('fetch')
        })

        // Check that the crop has been changed from SPINACH back to BEET
        cy.get('@fetch').then((response) => {
            expect(response.status).to.equal(200)  // 200 - OK/success
            expect(response.data.crop[0].id).to.equal(cropToIDMap.get('BEET'))

            // We know we have correctly updated the asset, so now delete it directly
            // from the database using the deleteRecord function from FarmOSAPI.js
            cy.wrap(deleteRecord(url, sessionToken)).as('delete')
        })

        // Wait here for the record to be deleted and check that it worked.
        cy.get('@delete').then((response) => {
            expect(response.status).to.equal(200)  // 200 - OK/success
        })
    })

    it('Click the Delete Asset button and then ', () => {
        // Create the asset by clicking the button.
        cy.get('[data-cy=create-planting]').click()
        cy.get('[data-cy=planting-status]')
            .should('have.text', '201')  // 201 = created

        // The asset has been created, so now we can
        // delete it by clicking the button
        cy.get('[data-cy=delete-planting]').click()

        // If successfully deleted we should get a 200 status.
        cy.get('[data-cy=planting-status]')
            .should('have.text', '200')  // 200 - OK/success
    })
})