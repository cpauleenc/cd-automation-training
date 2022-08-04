describe("[API] Kumu Live Web - Homepage", () => {
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

  it("should display Livestream list", () => {
    cy.request({
      method: "POST",
      url: "https://dev-liveapi-v8.kumu.live/site/get-live",
      headers: {
        "Device-Id": deviceId,
        "X-Kumu-Auth": auth_token,
      },
      qs: {
        mode: 'all',
        page: 1,
        size: 18,
        prev_ids: '',
        page_size: 18
      }
    }).then((response) => {
      let data = response.body.data;
      const count = data.count;

      expect(data).to.have.property('lives');
      expect(data).to.have.property('count');
      expect(count.lives_count).to.be.greaterThan(0);
      assert.isObject(count, 'value is object');
      assert.isArray(data.lives, 'lives is an array')
    });
  });

  it("should display Shop list", () => {
    cy.request({
      method: "POST",
      url: "https://dev-liveapi-v8.kumu.live/site/get-shop-live-data",
      headers: {
        "Device-Id": deviceId,
        "X-Kumu-Auth": auth_token,
      },
      qs: {
        mode: 'all',
        page: 1,
        size: 18,
        prev_ids: '',
        page_size: 18
      }
    }).then((response) => {
      let data = response.body.data;
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      assert.isArray(data, 'value is array');
    });
  });

  it("should display the list of livestream upon clicking the Browse button", () => {
    cy.request({
      method: "POST",
      url: "https://dev-liveapi-v8.kumu.live/site/get-browse-live",
      headers: {
        "Device-Id": deviceId,
        "X-Kumu-Auth": auth_token,
      },
    }).then((response) => {
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
  