var FarmOSAPI = require('../resources/FarmOSAPI.js')

var getIDToUserMap = FarmOSAPI.getIDToUserMap
var getUserToIDMap = FarmOSAPI.getUserToIDMap

describe('Test the use of maps between farmOS ids and values', () => {

    let idToUserMap = new Map();
    let userToIDMap = new Map();

    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        .then(() => {
            // This is in the then so that we are logged in before attempting
            // to fetch the maps.
            getUserToIDMap().then((response) => {
                userToIDMap = response
            })
            getIDToUserMap().then((response) => {
                idToUserMap = response
            })
        })

        cy.visit('/farm/fd2-example/maps')
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