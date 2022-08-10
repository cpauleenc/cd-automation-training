describe('[API] Kumu Live Web - Homepage', () => {
  /*
  Scenarios:
  1. Login user
  2. Display list of livestreams
  3. Display list of Shops
  4. Display list of Klips
  5. Display Popular Channels
  */

  let token, guid, accesskey, auth_token, deviceId;

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
    cy.getHeaders().then((response) => {
      deviceId = response.deviceId
    });
  });

  it('should display Livestream list', () => {
    cy.getAllLivestreams(deviceId, auth_token).then((response) => {
      let data = response.body.data;
      const count = data.count;

      expect(data).to.have.property('lives');
      expect(data).to.have.property('count');
      expect(count.lives_count).to.be.greaterThan(0);
      assert.isObject(count, 'value is object');
      assert.isArray(data.lives, 'lives is an array')
    });
  });

  it('should display Shop list', () => {
    cy.getAllShops(deviceId, auth_token).then((response) => {
      let data = response.body.data;

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      assert.isArray(data, 'value is array');
    });
  });

  it('should display Popular Channels list', () => {
    cy.getAllPopularChannels(deviceId).then((response) => {
      let data = response.body.data;
      const count = data.count;

      expect(data).to.have.property('list');
      expect(data).to.have.property('page').to.equal(1);
      expect(data).to.have.property('count');
      expect(count).to.be.greaterThan(0);
      assert.isArray(data.list, 'list is an array')
    });
  });

  it('should display the list of livestream upon clicking the Browse button', () => {
    cy.getBrowseLivestreams(deviceId, auth_token).then((response) => {
      let data = response.body.data;
      const count = data.count;

      expect(data).to.have.property('lives');
      expect(data).to.have.property('count');
      expect(count.lives_count).to.be.greaterThan(0);
      assert.isObject(count, 'value is object');
      assert.isArray(data.lives, 'lives is an array')
    });
  });

  after(function () {
    cy.logOut().then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});
  