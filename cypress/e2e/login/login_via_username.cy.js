describe("Kumu Live Web - Login via QR Code", () => {
  let token, guid, accesskey, auth_token, channel_id;

  it("should generate KUMU token", () => {
    cy.request({
      method: "POST",
      url: "https://dev-api.kumuapi.com/user/login",
      headers: {
        "Device-Id": "e158c2d6431ec31a",
        "Device-Type": "ios",
        "Version-Code": "780A",
      },
      body: {
        country_code: "+63",
        cellphone: "0000098611",
        verification_code: "881456",
      },
    }).then((response) => {
      token = response.body.data.token;
      guid = response.body.data.guid;
      cy.log("response: " + token);
      cy.log("response: " + guid);
    });
  });

  it("should generate QR Code", () => {
    cy.request({
      method: "POST",
      url: "https://dev-liveapi.kumu.live/site/generate-qr-code",
      qs: {
        "Device-Id": "608a63ad402cc",
      },
    }).then((response) => {
      accesskey = response.body.data.accesskey;
      cy.log("response: ", response);
    });
  });

  it("should scan the QR Code", () => {
    cy.request({
      method: "POST",
      url: "https://dev-api.kumuapi.com/web/site/qr-sign-in",
      headers: {
        "x-kumu-token": token,
        "Device-Id": "e158c2d6431ec31a",
        "Device-Type": "ios",
        "Version-Code": "780A",
        "x-kumu-userid": guid,
        "Content-Type": "application/json",
      },
      body: {
        accesskey,
      },
    }).then((response) => {
      cy.log("response: ", response);
    });
  });

  it("should logged in via QR Code", () => {
    cy.request({
      method: "POST",
      url: "https://dev-liveapi.kumu.live/site/check-qr-sign-in",
      qs: {
        accesskey,
      },
    }).then((response) => {
      auth_token = response.body.data.token;
      cy.log("response: ", response);
    });
  });
});
