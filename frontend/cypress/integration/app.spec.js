
describe("test the form", () => {
  it("enters the properties", () => {
    cy.visit("http://localhost:3000/")
    cy.contains("Name").click().type("Test")
    cy.contains("ID").click().type("A") // auto generate
    cy.contains("Created by").click().type("Me")
    cy.contains("Instructions").click().type("A")
    cy.get('#form_properties_post_url').should("have.value", "https://make.momentumresearch.eu/api/v1/response")
    cy.contains("Post URL").click().type("any other url") // validate for url
    cy.contains("Empty Message").click().type("Woohoo")
    cy.contains("Banner URL").click().type("aaaa") // validate for url
    cy.contains("Support URL").click().type("bbb") // validate for url
    cy.contains("Support Email").click().type("ccc") // validate for email
    cy.contains("Cache Media").click()
    cy.contains("Ethics Statement").click().type("A")
    cy.contains("Plain Language Statement").click().type("B") // validate for url
    cy.contains("Conditions").parent().parent().within(($el) => {
      cy.contains("A list of conditions that participants can be randomised into.")
      cy.contains("Add Item").click()
    })

    cy.contains("Modules").parent().parent().within((el) => {
      cy.contains("Add Item").click()
      cy.contains("Type")
      cy.get('#form_modules_0_type').click().select("survey")
      cy.contains("Name").click().type("Test")

      cy.contains("Submit Text").click().type("Submit")
      cy.contains("Title").click().type("Test alert")
      cy.contains("Message").click().type("msg")
      cy.contains("Duration").click().type("100")
      cy.contains("Add Item").click()
      cy.contains("The times that this module should be scheduled for each day. hours indicates the hours (24-hour time) and minutes indicates the minutes (so should be between 0 and 59).")
      cy.contains("Hour").click().type("12") // validate for number 
      cy.contains("Minute").click().type("30")
      cy.contains("Graph").parent().parent().within(($el) => {
        cy.contains("Display graph").click()
        cy.contains("Variable").click().type("A")
      })
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")
      cy.contains("").click().type("")

    })
  })
