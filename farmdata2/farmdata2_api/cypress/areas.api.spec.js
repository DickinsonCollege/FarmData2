describe("Test http://fd2_api/areas", () => {
  before(() => {
    // change base url from http://fd2_farmdata2 to http://fd2_api
    Cypress.config("baseUrl", "http://fd2_api");
  });

  it("Test mapByName", () => {
    cy.request("/areas/mapbyName").as("mapByName");
    cy.get("@mapByName").then((mapByName) => {
      expect(mapByName.status).to.eq(200);
      assert.isObject(mapByName.body, "mapByName Response is an object");
      expect(Object.keys(mapByName.body)[0]).to.eq("A");
      expect(
          Object.keys(mapByName.body)[Object.keys(mapByName.body).length - 1]
      ).to.eq("Z");
      expect(Object.keys(mapByName.body).length).to.eq(70);
    });
  });

  it("Test mapById", () => {
    cy.request("/areas/mapById").as("mapById");
    cy.get("@mapById").then((mapById) => {
      expect(mapById.status).to.eq(200);
      assert.isObject(mapById.body, "mapById Response is an object");
      expect(Object.keys(mapById.body)[0]).to.eq("170");
      expect(
          Object.keys(mapById.body)[Object.keys(mapById.body).length - 1]
      ).to.eq("239");
      expect(Object.keys(mapById.body).length).to.eq(70);
    });
  });
});