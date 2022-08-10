describe('[API] Kumu Live Web - Klips > Follow or Unfollow Streamer', () => {
  /*
  Scenarios:
  1. Login user
  2. Display klip page/list
  3. View specific klip
  4. View a streamer's profile
  5. Follow a streamer in a klip
  6. Unfollow a streamer in a klip
  */
 
  let token, guid, accesskey, auth_token, deviceId,
      streamer_influencer_id, streamer_follower_number, action;

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

  //Klip Tags
  it('should display klips list', () => {
    cy.request({
      method: 'POST',
      url: Cypress.env('devKumuLiveApi') + '/feed/tags',
      headers: {
        'Device-Id': deviceId,
      },
      form: true,
      body: {
        page: 1,
        page_size: 5
      }
    }).then((response) => {
      let data = response.body.data;

      expect(response.status).to.equal(200);
      expect(data).to.have.property('list');
      expect(data.list.length).to.be.greaterThan(0);
      expect(data.page_size).to.equal(5);
      expect(data.page).to.equal(1);
      assert.isArray(data.list, 'list is an array');
    });
  });

  //Specfic Klip
  it('should display specific klip details', () => {
    cy.request({
      method: 'POST',
      url: Cypress.env('devKumuLiveApi') + '/feed/peek',
      headers: {
        'Device-Id': deviceId,
      },
      form: true,
      body: {
        page: 1,
        page_size: 12,
        feed_type: 'video',
        exclude_my_recordings: 1,
        query_id: 'MgQg3u6Trycu8gcE',
      }
    }).then((response) => {
      let data = response.body.data;
      
      expect(response.status).to.equal(200);
      expect(data).to.have.property('list');
      expect(data.list.length).to.be.greaterThan(0);
      expect(data.page_size).to.equal(12);
      expect(data.page).to.equal(1);
      expect(data).to.have.property('trend_titles');
      expect(data.trend_titles.length).to.be.greaterThan(0);
      expect(data.trend_titles).includes('Images', 'Videos', 'Live');
      assert.isArray(data.list, 'list is an array');
      assert.isArray(data.trend_titles, 'trend titles is an array');
    });
  });

  //Display streamer profile
  it('should display streamers profile details', () => {
    const username = 'testip61_testip61_'

    cy.getUserProfile(auth_token, username).then((response) => {
      let data = response.body.data;
      streamer_influencer_id = data.guid;

      expect(response.status).to.eq(200);
    });
  });

  it('should follow a steamer', () => {
    action = 0;
    cy.follow(deviceId, auth_token, action, streamer_influencer_id).then((response) => {
      streamer_follower_number = response.body.data.follower_number;
      action = 1;

      cy.follow(deviceId, auth_token, action, streamer_influencer_id)
        .then((response) => {
          let data = response.body.data;
          const follower_number = data.follower_number;
          expect(response.status).to.eq(200);
          expect(data).property('follower_number');
          expect(follower_number).to.be.greaterThan(streamer_follower_number);
          expect(data).property('guid').to.eq(streamer_influencer_id);
          expect(data).property('nickname').to.eq('testios_021');
        });
    });
  });

  it('should unfollow a streamer', () => {
    action = 0;
    cy.follow(deviceId, auth_token, action, streamer_influencer_id).then((response) => {
      let data = response.body.data;
      const follower_number = data.follower_number;

      expect(response.status).to.eq(200);
      expect(data).property('follower_number');
      expect(data).property('guid').to.eq(streamer_influencer_id);
      expect(follower_number).to.eq(streamer_follower_number);
      expect(data).property('nickname').to.eq('testios_021');
    })
  })

  after(function () {
    cy.logOut().then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});
    