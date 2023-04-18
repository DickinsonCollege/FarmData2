describe('API Request Functions', () => {
  beforeEach(() => {
      // change base url from http://fd2_farmdata2 to http://fd2_api
      Cypress.config('baseUrl', "http://fd2_api")
  })

  it('Test mapByName', () => {
      cy.request('/areas/mapbyName').as('mapByName');
      cy.get('@mapByName').then(mapByName => {
          expect(mapByName.status).to.eq(200);
          assert.isObject(mapByName.body, 'mapByName Response is an object')
          cy.log(JSON.stringify(mapByName.body))
      });
  })

  it('Test mapById', () => {
      cy.request('/areas/mapById').as('mapById');
      cy.get('@mapById').then(mapById => {
          expect(mapById.status).to.eq(200);
          assert.isObject(mapById.body, 'mapById Response is an object')
          cy.log(JSON.stringify(mapById.body))
      });
  })
})