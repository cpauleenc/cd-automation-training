describe.only('[API] Kumu Live Web - Account Settings', () => {
   /*
  Scenarios:
  1. Login user
  2. Display Profile Account Settings
  3. Display Account Information
  4. Display Account Diamonds and Coins
  */

  let token, guid, accesskey, auth_token, users;

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
    cy.getUsers().then((response) => {
      users = response;
    });
  });

  it('should display Account Information', () => {
    cy.getUserProfile(auth_token, username).then((response) => {
      let data = response.body.data;

      expect(response.status).to.equal(200);
      assert.isObject(data, 'value is object');
      expect(data).property('username').to.equal('test_yan_main');
      expect(data).to.have.property('guid').to.equal(guid);
      expect(data).to.have.property('user_id');
      expect(data).to.have.property('avatar'); 
    });
  });

  it('should display Coins and Diamonds', () => {
    const username = users[0].username;
    cy.getUserProfile(auth_token, username).then((response) => {
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
