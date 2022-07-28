describe("Kumu Live Web - Homepage", () => {
  let token, guid, accesskey, auth_token, channel_id;

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

  it("should display Livestream list", () => {
    cy.request({
      method: "POST",
      url: "https://dev-liveapi-v8.kumu.live/site/get-live",
      headers: {
        "Device-Id": cy.getHeaders().deviceId,
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
      expect(data).to.have.property('lives');
      assert.isArray(data.lives, 'lives is an array')
    });
  });

  it("should display Shop list", () => {
    cy.request({
      method: "POST",
      url: "https://dev-liveapi-v8.kumu.live/site/get-shop-live-data",
      headers: {
        "Device-Id": cy.getHeaders().deviceId,
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
    });
  });

  it("should display the list of livestream upon clicking the Browse button", () => {
    cy.request({
      method: "POST",
      url: "https://dev-liveapi-v8.kumu.live/site/get-browse-live",
      headers: {
        "Device-Id": cy.getHeaders().deviceId,
        "X-Kumu-Auth": auth_token,
      },
    }).then((response) => {
      let data = response.body.data;

      expect(data).to.have.property('lives');
      assert.isArray(data.lives, 'lives is an array')
    });
  });

  after(function () {
    cy.logOut().then((response) => {
      channel_id = response.body.data.channel_id;
      expect(response.status).to.equal(200);
    });
  });
});
  