describe('Test http://fd2_api/crops', () => {
    before(() => {
        // change base url from http://fd2_farmdata2 to http://fd2_api
        Cypress.config('baseUrl', "http://fd2_api")
    })

    it('Test mapByName', () => {
        cy.request('/crops/mapbyName').as('mapByName');
        cy.get('@mapByName').then(mapByName => {
            expect(mapByName.status).to.eq(200);
            assert.isObject(mapByName.body, 'mapByName Response is an object')
            expect(Object.keys(mapByName.body)[0]).to.eq("ARUGULA");
            expect(
                Object.keys(mapByName.body)[Object.keys(mapByName.body).length - 1]
            ).to.eq("ZUCCHINI");
            expect(Object.keys(mapByName.body).length).to.eq(111);
        });
    })

    it('Test mapById', () => {
        cy.request('/crops/mapById').as('mapById');
        cy.get('@mapById').then(mapById => {
            expect(mapById.status).to.eq(200);
            assert.isObject(mapById.body, 'mapById Response is an object')
            expect(Object.keys(mapById.body)[0]).to.eq("41");
            expect(
                Object.keys(mapById.body)[Object.keys(mapById.body).length - 1]
            ).to.eq("169");
            expect(Object.keys(mapById.body).length).to.eq(111);
        });
    })
})