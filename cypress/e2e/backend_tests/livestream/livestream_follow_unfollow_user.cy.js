describe("API] Kumu Live Web - Livestream > Follow or Unfollow Streamer", () => {

  /*
  Scenarios:
  1. Login user
  2. Display user's profile details
  3. Follow a streamer's profile inside livestream
  4. Unfollow a streamer's profile inside livestream
  */

  let token, guid, accesskey, auth_token, streamer_influencer_id,
      steamer_follower_number, action, users;

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

  it("should display streamer's profile details", () => {
    const username = users[2].username;
    cy.getUserProfile(auth_token, username).then((response) => {
      let data = response.body.data;
      streamer_influencer_id = data.guid;
    });
  });

  it("should follow a steamer", () => {
    action = 0;
    cy.follow(auth_token, action, streamer_influencer_id).then((response) => {
      steamer_follower_number = response.body.data.follower_number;
      const curr_steamer_follower_number = steamer_follower_number;
      action = 1;

      cy.follow(auth_token, action, streamer_influencer_id).then((response) => {
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

  it("should unfollow a streamer", () => {
    action = 0;
    cy.follow(auth_token, action, streamer_influencer_id).then((response) => {
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