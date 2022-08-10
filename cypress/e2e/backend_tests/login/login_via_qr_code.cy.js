describe('[API] Kumu Live Web - Login via QR Code', () => {
  let token, guid, accesskey;

  it('should generate KUMU token', () => {
    cy.generateToken().then((response) => {
      token = response.body.data.token;
      guid = response.body.data.guid;
    });
  });

  it('should generate QR Code', () => {
    cy.generateQRCode().then((response) => {
      accesskey = response.body.data.accesskey;
      expect(response.status).to.equal(200);
    });
  });

  it('should scan the QR Code', () => {
    cy.scanQRCode(token, guid, accesskey).then((response) => {
      expect(response.status).to.equal(200);
    });
  });

  it('should logged in via QR Code', () => {
    cy.loginViaQRCode(accesskey).then((response) => {
      const auth_token = response.body.data.token;
      const data = response.body.data;

      expect(data).to.have.property('token');
      expect(response.status).to.equal(200);
      expect(auth_token).not.to.be.empty;
    });
  });
});
