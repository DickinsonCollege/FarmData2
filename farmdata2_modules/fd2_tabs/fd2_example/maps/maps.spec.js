/**
 * The Maps subtab illustrates the use of some of the maps provided 
 * by the FarmOSAPI.js library by displaying information from the 
 * userToIDMap and the idToUserMap.  This spec tests that the data 
 * displayed matches the values in the database.
 */

var FarmOSAPI = require('../../resources/FarmOSAPI.js')

var getIDToUserMap = FarmOSAPI.getIDToUserMap
var getUserToIDMap = FarmOSAPI.getUserToIDMap

describe('Test the use of maps between farmOS ids and values', () => {

    let idToUserMap = new Map();
    let userToIDMap = new Map();

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        .then(() => {
            // Request the IDtoUserMap and UserToIDMAP.
            cy.wrap(getIDToUserMap()).as('idusermap')
            cy.wrap(getUserToIDMap()).as('useridmap')
        })

        // Wait here for the maps to load in the tests so that they are
        // available as the tests are run.
        cy.get('@useridmap').then(function(map) {
            userToIDMap = map
        })
        cy.get('@idusermap').then(function(map) {
            idToUserMap = map
        })
        
        cy.visit('/farm/fd2-example/maps')

        // The page itself uses API calls to load the IDToUserMap and 
        // the UserToIDMap also. So we wait here to ensure that the page 
        // is fully loaded before we begin testing.
        cy.waitForPage()
    })

    it('Check the mapping from usermame to user id.', () => {
        // Use the map here (and below) so that this works if sample data changes.
        cy.get('[data-cy=mapped-id]')
           .should('have.text', userToIDMap.get('manager1'))
    })

    it('Check the mapping from user id to username.', () => {
        cy.get('[data-cy=mapped-name]')
            .should('have.text', idToUserMap.get(userToIDMap.get('manager1')))
    })

    it('Check the full table of mappings against the database.', () => {
        // Sort our map keys so the order matches the displayed table.
        let keys = Array.from(idToUserMap.keys());
        keys.sort(function(a,b) { 
            return Number(a) - Number(b);
        })
               
        // Skip the anonymous entry (0) since it has no user id and does
        // not appear in the table.
        for (let i=1; i<userToIDMap.size; i++) {
            // Check the user id.
            cy.get('[data-cy='+i+'id]')
                .should('have.text', keys[i])

            // Check the username
            cy.get('[data-cy='+i+'name]')
                .should('have.text', idToUserMap.get(keys[i]))    
        } 
    })
})