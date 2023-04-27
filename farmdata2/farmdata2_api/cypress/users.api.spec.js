describe('Test http://fd2_api/users', () => {
  before(() => {
      // change base url from http://fd2_farmdata2 to http://fd2_api
      Cypress.config('baseUrl', "http://fd2_api")
  })

  it('Test mapByName', () => {
      cy.request('/users/mapbyName').as('mapByName');
      cy.get('@mapByName').then(mapByName => {
          expect(mapByName.status).to.eq(200);
          assert.isObject(mapByName.body, 'mapByName Response is an object');
          expect(Object.keys(mapByName.body)[0]).to.eq("admin");
          expect(
              Object.keys(mapByName.body)[Object.keys(mapByName.body).length - 1]
          ).to.eq("worker5");
          expect(Object.keys(mapByName.body).length).to.eq(10);
      });
  })

  it('Test mapById', () => {
      cy.request('/users/mapById').as('mapById');
      cy.get('@mapById').then(mapById => {
          expect(mapById.status).to.eq(200);
          assert.isObject(mapById.body, "mapById Response is an object");
          expect(Object.keys(mapById.body)[0]).to.eq("1");
          expect(
              Object.keys(mapById.body)[Object.keys(mapById.body).length - 1]
          ).to.eq("11");
          expect(Object.keys(mapById.body).length).to.eq(10);
      });
  })
})