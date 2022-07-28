describe("Kumu Live Web - Login via QR Code", () => {
  let token, guid, accesskey, auth_token, channel_id;

  it("should generate KUMU token", () => {
    cy.generateToken().then((response) => {
      token = response.body.data.token;
      guid = response.body.data.guid;
    });
  });

  it("should generate QR Code", () => {
    cy.generateQRCode().then((response) => {
      accesskey = response.body.data.accesskey;
      cy.log("response: ", response);
    });
  });

  it("should scan the QR Code", () => {
    cy.scanQRCode(token, guid, accesskey).then((response) => {
      cy.log("response: ", response);
    });
  });

  it("should logged in via QR Code", () => {
    cy.loginViaQRCode(accesskey).then((response) => {
      auth_token = response.body.data.token;
      expect(response.status).to.equal(200);
      cy.log("response: ", response);
    });
  });
});
