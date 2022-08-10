// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
// ***********************************************

let headers = require('../fixtures/headers.json');
let users = require('../fixtures/users.json');

// Headers fixtures
Cypress.Commands.add('getHeaders', () => {
  return headers;
});

// Users fixtures
Cypress.Commands.add('getUsers', () => {
  return users;
});

// Generate Token in kumuapi
Cypress.Commands.add('generateToken', () => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuApi') + '/user/login',
    headers: {
      'Device-Id': headers.deviceId,
      'Device-Type': headers.deviceType,
      'Version-Code': headers.versionCode,
    },
    body: {
      country_code: '+63',
      cellphone: '0000098611',
      verification_code: '881456',
    },
  });
});

// Generate QR Code
Cypress.Commands.add('generateQRCode', () => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/site/generate-qr-code',
    qs: {
      'Device-Id': headers.deviceId,
    },
  });
});

// Scan QR Code
Cypress.Commands.add('scanQRCode', (token, guid, accesskey) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuApi') + '/web/site/qr-sign-in',
    headers: {
      'x-kumu-token': token,
      'Device-Id': headers.deviceId,
      'Device-Type': headers.deviceType,
      'Version-Code': headers.versionCode,
      'x-kumu-userid': guid,
      'Content-Type': 'application/json',
    },
    body: {
      accesskey,
    },
  });
});

// Login user via QR Code
Cypress.Commands.add('loginViaQRCode', (accesskey) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/site/check-qr-sign-in',
    qs: {
      accesskey,
    },
  });
});

// User OAuth Login
Cypress.Commands.add('OAuthLogin', (oauth_provider, oauth_id) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/user/oauth-login',
    headers: {
      'Device-Id': headers.deviceId
    },
    form: true,
    body: {
      oauth_provider: oauth_provider,
      oauth_id: oauth_id
    }
  });
});

// User OAuth Token
Cypress.Commands.add('OAuthToken', (user_guid, otp) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/user/oauth-token',
    headers: {
      'Device-Id': headers.deviceId
    },
    form: true,
    body: {
      username: user_guid,
      otp: otp
    }
  });
});

// Get User Profile
Cypress.Commands.add('getUserProfile', (auth_token, username) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/user/profile',
    headers: {
      'Device-Id': headers.deviceId,
      'X-Kumu-Auth': auth_token,
    },
    form: true,
    body: {
      username: username,
    }
  });
});

// Follow or Unfollow
Cypress.Commands.add('follow', (deviceId, auth_token, action, influencer_id) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/user/follow',
    headers: {
      'Device-Id': deviceId,
      'X-Kumu-Auth': auth_token,
    },
    form: true,
    body: {
      influencer_id: influencer_id,
      action: action
    }
  })
})

// Display List of Livestreams
Cypress.Commands.add('getAllLivestreams', (deviceId, auth_token) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/site/get-live',
    headers: {
      'Device-Id': deviceId,
      'X-Kumu-Auth': auth_token,
    },
    qs: {
      mode: 'all',
      page: 1,
      size: 18,
      prev_ids: '',
      page_size: 18
    }
  })
})

// Display List of Shops
Cypress.Commands.add('getAllShops', (deviceId, auth_token) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/site/get-shop-live-data',
    headers: {
      'Device-Id': deviceId,
      'X-Kumu-Auth': auth_token,
    },
    qs: {
      mode: 'all',
      page: 1,
      size: 18,
      prev_ids: '',
      page_size: 18
    }
  })
})

// Display List of Popular Channels
Cypress.Commands.add('getAllPopularChannels', (deviceId) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/live/recommend',
    headers: {
      'Device-Id': deviceId,
      'X-Kumu-Auth': 'undefined',
    }
  })
})

// Display List of Livestreams via Browse tab
Cypress.Commands.add('getBrowseLivestreams', (deviceId, auth_token) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/site/get-browse-live',
    headers: {
      'Device-Id': deviceId,
      'X-Kumu-Auth': auth_token,
    },
  })
})

// Logout user
Cypress.Commands.add('logOut', (auth_token) => {
  return cy.request({
    method: 'POST',
    url: Cypress.env('devKumuLiveApi') + '/site/login-out',
    headers: {
      'Device-Id': headers.deviceId,
      'X-Kumu-Auth': auth_token,
    },
  });
});
