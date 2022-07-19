// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// Generate Token in kumuapi
Cypress.Commands.add("generateToken", () => {
  const response = cy.request({
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
  });

  return response;
});

// Generate QR Code
Cypress.Commands.add("generateQRCode", () => {
  const response = cy.request({
    method: "POST",
    url: "https://dev-liveapi.kumu.live/site/generate-qr-code",
    qs: {
      "Device-Id": "608a63ad402cc",
    },
  });

  return response;
});

// Scan QR Code
Cypress.Commands.add("scanQRCode", (token, guid, accesskey) => {
  const response = cy.request({
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
  });

  return response;
});

// Login user via QR Code
Cypress.Commands.add("loginViaQRCode", (accesskey) => {
  const response = cy.request({
    method: "POST",
    url: "https://dev-liveapi.kumu.live/site/check-qr-sign-in",
    qs: {
      accesskey,
    },
  });

  return response;
});

// Logout user
Cypress.Commands.add("logOut", (auth_token) => {
  const response = cy.request({
    method: "POST",
    url: "https://dev-liveapi.kumu.live/site/login-out",
    headers: {
      "Device-Id": "e158c2d6431ec31a",
      "X-Kumu-Auth": auth_token,
    },
  });

  return response;
});
