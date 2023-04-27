describe("Testing SubTabs in BarnKit", () => {
    beforeEach(() => {
        cy.login('manager1', 'farmdata2')
        cy.visit('/farm/fd2-barn-kit')
    })

    it("BarnKit tab contains the subtabs" , () => {
        cy.get(".pagination-sm").contains("Info").should("exist")
        cy.get(".pagination-sm").contains("Seeding Report").should("exist")
        cy.get(".pagination-sm").contains("Transplanting Report").should("exist")
    }) 

    it("BarnKit tabs are ordered properly" , () => {
        cy.get(".pagination-sm > li > a").eq(0).should("contain.text", "Info")
        cy.get(".pagination-sm > li > a").eq(1).should("contain.text", "Seeding Report")
        cy.get(".pagination-sm > li > a").eq(2).should("contain.text", "Transplanting Report")
    }) 

    it("BarnKit has three sub tabs" , () => {
        cy.get(".pagination-sm > li").should("have.length", "3") 
    }) 
})
