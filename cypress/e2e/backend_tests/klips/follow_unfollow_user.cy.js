describe('[API] Kumu Live Web - Klips > Follow or Unfollow Streamer', () => {
  /*
  Scenarios:
  1. Login user
  2. Display klip page/list
  3. Follow klip user
  4. Follow klip user
  */
 
  let token, guid, accesskey, auth_token, deviceId, streamer_influencer_id, steamer_follower_number;

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
      url: 'https://dev-liveapi-v8.kumu.live/feed/tags',
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
      const count = data.count;

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
      url: 'https://dev-liveapi-v8.kumu.live/feed/peek',
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
      const count = data.count;
      
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
    cy.request({
      method: 'POST',
      url: Cypress.env('devKumuLiveApi') + '/user/profile',
      headers: {
        'Device-Id': deviceId,
        'X-Kumu-Auth': auth_token,
      },
      form: true,
      body: {
        username: 'testip61_testip61_',
      }
    }).then((response) => {
      let data = response.body.data;
      streamer_influencer_id = data.guid;
    });
  });

  it('should follow a steamer', () => {
    cy.request({
      method: 'POST',
      url: Cypress.env('devKumuLiveApi') + '/user/follow',
      headers: {
        'Device-Id': deviceId,
        'X-Kumu-Auth': auth_token,
      },
      form: true,
      body: {
        // username = testip61_testip61_
        influencer_id: streamer_influencer_id,
        // unfollow
        action: 0
      }
    }).then((response) => {

      steamer_follower_number = response.body.data.follower_number;
      const curr_steamer_follower_number = steamer_follower_number;
      cy.request({
        method: 'POST',
        url: Cypress.env('devKumuLiveApi') + '/user/follow',
        headers: {
          'Device-Id': deviceId,
          'X-Kumu-Auth': auth_token,
        },
        form: true,
        body: {
          // username = testip61_testip61_
          influencer_id: streamer_influencer_id,
          // follow
          action: 1
        }
      }).then((response) => {
        let data = response.body.data;
        const follower_number = data.follower_number;
        expect(response.status).to.eq(200)
        expect(data).property('follower_number');
        expect(follower_number).to.be.greaterThan(curr_steamer_follower_number);
        expect(data).property('guid').to.eq(streamer_influencer_id);
        expect(data).property('nickname').to.eq('testios_021');
      });
    });
  });

  it('should unfollow a streamer', () => {
    cy.request({
      method: 'POST',
      url: Cypress.env('devKumuLiveApi') + '/user/follow',
      headers: {
        'Device-Id': deviceId,
        'X-Kumu-Auth': auth_token,
      },
      form: true,
      body: {
        // username = testip61_testip61_
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
      expect(data).property('nickname').to.eq('testios_021');
    })
  })

  after(function () {
    cy.logOut().then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});
    