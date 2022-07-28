describe("Kumu Live Web - View Profile", () => {
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

  it("should display Account Settings", () => {
    cy.request({
      method: "POST",
      url: "https://dev-liveapi.kumu.live/user/profile",
      headers: {
        "Device-Id": "e158c2d6431ec31a",
        "X-Kumu-Auth": auth_token,
      },
    }).then((response) => {
      cy.log('response: ', response);
      // channel_id = response.body.data.channel_id;
      expect(response.status).to.equal(200);
    });
  });

  after(function () {
    cy.logOut().then((response) => {
      channel_id = response.body.data.channel_id;
      // expect(response.status).to.equal(204);
    });
  });
});
