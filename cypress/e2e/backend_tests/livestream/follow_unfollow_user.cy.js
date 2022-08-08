describe("API] Kumu Live Web - Livestream > Follow or Unfollow Streamer", () => {

  /*
  Scenario:
  1. Login user
  2. Display user's profile details
  3. Follow a streamer's profile inside livestream
  4. Unfollow a streamer's profile inside livestream
  */

  let token, guid, accesskey, auth_token, streamer_influencer_id, deviceId, steamer_follower_number;

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
      deviceId = response.deviceId;
    });
  });

  it("should display streamer's profile details", () => {
    cy.request({
      method: "POST",
      url: Cypress.env('devKumuLiveApi') + '/user/profile',
      headers: {
        "Device-Id": deviceId,
        "X-Kumu-Auth": auth_token,
      },
      form: true,
      body: {
        username: 'testuser123'
      }
    }).then((response) => {
      let data = response.body.data;
      streamer_influencer_id = data.guid;
    });
  });

  it("should follow a steamer", () => {
    cy.request({
      method: "POST",
      url: Cypress.env('devKumuLiveApi') + '/user/follow',
      headers: {
        "Device-Id": deviceId,
        "X-Kumu-Auth": auth_token,
      },
      form: true,
      body: {
        // username = testuser123
        influencer_id: streamer_influencer_id,
        // unfollow
        action: 0
      }
    }).then((response) => {
      steamer_follower_number = response.body.data.follower_number;
      const curr_steamer_follower_number = steamer_follower_number;
      cy.request({
        method: "POST",
        url: Cypress.env('devKumuLiveApi') + '/user/follow',
        headers: {
          "Device-Id": deviceId,
          "X-Kumu-Auth": auth_token,
        },
        form: true,
        body: {
          // username = testuser123
          influencer_id: streamer_influencer_id,
          // follow
          action: 1
        }
      }).then((response) => {
        let data = response.body.data;
        const follower_number = data.follower_number;
        expect(response.status).to.eq(200);
        expect(data).property('follower_number');
        expect(follower_number).to.be.greaterThan(curr_steamer_follower_number);
        expect(data).property('guid').to.eq(streamer_influencer_id);
        expect(data).property('nickname').to.eq('testuser');
      })
    })
  })
d
  it("should unfollow a streamer", () => {
    cy.request({
      method: "POST",
      url: Cypress.env('devKumuLiveApi') + '/user/follow',
      headers: {
        "Device-Id": deviceId,
        "X-Kumu-Auth": auth_token,
      },
      form: true,
      body: {
        // username = testuser123
        influencer_id: streamer_influencer_id,
        // unfollow
        action: 0
      }
    }).then((response) => {
      let data = response.body.data;
      const follower_number = data.follower_number;
      expect(response.status).to.eq(200);
      expect(data).property('follower_number');
      expect(data).property('guid').to.eq(streamer_influencer_id);
      expect(follower_number).to.eq(steamer_follower_number);
      expect(data).property('nickname').to.eq('testuser');
    })
  })

  after(function () {
    cy.logOut().then((response) => {
      expect(response.status).to.equal(200);
    })
  })

})