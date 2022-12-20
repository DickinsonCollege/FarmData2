var FarmOSAPI = require('../../resources/FarmOSAPI.js')

var getIDToUserMap = FarmOSAPI.getIDToUserMap
var getUserToIDMap = FarmOSAPI.getUserToIDMap

describe('Test the use of maps between farmOS ids and values', () => {

    let idToUserMap = new Map();
    let userToIDMap = new Map();

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        .then(() => {
            // Once we have logged in, request the maps.
            // Using cy.wrap allows us to wait for the asynchronus API requests
            // to complete before we continue (see cy.get just below). 
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
        cy.waitForPage()
    })

    it('check usermame to user id mapping', () => {
        // Use the map here (and below) so that this works if sample data changes.
        cy.get('[data-cy=mapped-id]')
           .should('have.text', userToIDMap.get('manager1'))
    })

    it('check user id to username mapping', () => {
        cy.get('[data-cy=mapped-name]')
            .should('have.text', idToUserMap.get(userToIDMap.get('manager1')))
    })

    it('check the table rows for map content', () => {
        let keys = Array.from(idToUserMap.keys());
        keys.sort(function(a,b) { 
            return Number(a) - Number(b);
        })
               
        // Skip the anonymous entry since it has no user id.
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