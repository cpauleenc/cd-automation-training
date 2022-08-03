describe.only("Kumu Live Web - Account Settings", () => {
  let token, guid, accesskey, auth_token;

  before(function () {
    cy.generateToken().then((response) => {
      token = response.body.data.token;
      guid = response.body.data.guid;
      cy.generateQRCode().then((response) => {
        accesskey = response.body.data.accesskey;
        cy.scanQRCode(token, guid, accesskey).then((response) => {
          cy.loginViaQRCode(accesskey).then((response) => {
            auth_token = response.body.data.token;
            expect(response.status).to.equal(200);
          });
        });
      });
    });
  });

  it("should display Account Information", () => {
    cy.getUserProfile(auth_token).then((response) => {
      let data = response.body.data;

      expect(response.status).to.equal(200);
      assert.isObject(data, 'value is object');
      expect(data).property('username').to.equal('test_yan_main');;
      expect(data).to.have.property('guid').to.equal(guid);
      expect(data).to.have.property('user_id');
      expect(data).to.have.property('avatar'); 
    });
  });

  it("should display Coins and Diamonds", () => {
    cy.getUserProfile(auth_token).then((response) => {
      let data = response.body.data;

      expect(response.status).to.equal(200);
      expect(data.guid).to.equal(guid);
      expect(data).to.have.property('coin');
      expect(data).to.have.property('diamond'); 
    });
  });

  after(function () {
    cy.logOut().then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});
