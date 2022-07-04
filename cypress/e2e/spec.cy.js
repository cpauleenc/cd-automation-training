describe("Kumu Live Web", () => {
  it("should navigate to homepage", () => {
    cy.viewport(1440, 900);
    cy.visit("https://dev.kumu.live");
  });
});
