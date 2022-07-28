// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
// ***********************************************
//
var headers = require('../fixtures/headers.json');

Cypress.Commands.add("getHeaders", () => {
  const response = headers;
  return response;
});

// Generate Token in kumuapi
Cypress.Commands.add("generateToken", () => {
  const response = cy.request({
    method: "POST",
    url: Cypress.env('devKumuApi') + '/user/login',
    headers: {
      "Device-Id": headers.deviceId,
      "Device-Type": headers.deviceType,
      "Version-Code": headers.versionCode,
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
    url: Cypress.env('devKumuLiveApi') + "/site/generate-qr-code",
    qs: {
      "Device-Id": headers.deviceId,
    },
  });

  return response;
});

// Scan QR Code
Cypress.Commands.add("scanQRCode", (token, guid, accesskey) => {
  const response = cy.request({
    method: "POST",
    url: Cypress.env('devKumuApi') + "/web/site/qr-sign-in",
    headers: {
      "x-kumu-token": token,
      "Device-Id": headers.deviceId,
      "Device-Type": headers.deviceType,
      "Version-Code": headers.versionCode,
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
    url: Cypress.env('devKumuLiveApi') + "/site/check-qr-sign-in",
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
    url: Cypress.env('devKumuLiveApi') + "/site/login-out",
    headers: {
      "Device-Id": headers.deviceId,
      "X-Kumu-Auth": auth_token,
    },
  });

  return response;
});
