var FarmOSAPI = require('../resources/FarmOSAPI.js')

var getIDToUserMap = FarmOSAPI.getIDToUserMap
var getUserToIDMap = FarmOSAPI.getUserToIDMap

describe('Test the use of maps between farmOS ids and values', () => {

    let idToUserMap = new Map();
    let userToIDMap = new Map();

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        .then(() => {
            // Once we have logged in, request the maps.
            cy.wrap(getIDToUserMap()).as('idusermap')
            cy.wrap(getUserToIDMap()).as('useridmap')
        })

        // Wait here for the maps to have load.
        cy.get('@useridmap').should(function(map) {
            userToIDMap = map
        })
        cy.get('@idusermap').should(function(map) {
            idToUserMap = map
        })

        // Because the page requests the IDToUserMap and UserToIDMap in the
        // created() hook, we need to be sure to wait for those to complete before
        // going on with the tests. Othewise we can get intermittent 403 errors when 
        // the test ends before the map has loaded in the page.
        cy.server()
        cy.route('GET', 'user').as('usermap')
        
        cy.visit('/farm/fd2-example/maps')

        cy.wait(['@usermap', '@usermap'])
    })

    it('check usermame to user id mapping', () => {
        // Use the map here so that this works if sample data changes.
        cy.get('[data-cy=mapped-id]')
           .should('have.text', userToIDMap.get('manager1'))
    })

    it('check user id to username mapping', () => {
        cy.get('[data-cy=mapped-name]')
            .should('have.text', idToUserMap.get(userToIDMap.get('manager1')))
    })

    it('check the table rows for map content', () => {
        keys = Array.from(idToUserMap.keys());
        keys.sort(function(a,b) { 
            return Number(a) - Number(b);
        })
               
        // Skip the anonymous entry since it has no user id.
        for (i=1; i<userToIDMap.size; i++) {
            // Check the user id.
            attr='[data-cy='+i+'id]'
            cy.get(attr)
                .should('have.text', keys[i])

            // Check the username
            attr='[data-cy='+i+'name]'
            cy.get(attr)
                .should('have.text', idToUserMap.get(keys[i]))    
        } 
    })
})