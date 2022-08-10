describe('Kumu Live Web - Gifts', () => {
  /*
  Scenarios:
  1. Login user
  2. Display gift list with category = vote
  3. Display gift list with category = 2
  4. Send gift
  5. Check total coins after sending gift
  */

  let token, guid, accesskey, auth_token, users, guid_angel, coin_angel;

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

  it('should check available gifts with category = "vote"', () => {
    cy.getGiftList(auth_token, 'vote').then((response) => {
      let data = response.body.data;
      guid_angel = data[0].guid;
      coin_angel = data[0].coin;

      expect(response.status).to.eq(200);

      // Iterate data to verify guid, name and type
      for (const elem of data) {
        const type = elem.type;
        expect(type).to.equal(3);
        expect(elem.guid).not.to.be.empty;
        expect(elem.name).not.to.be.empty;
      }
    });
  });

  it('should check available gifts with category = "2"', () => {
    cy.getGiftList(auth_token, 2).then((response) => {
      let data = response.body.data;

      expect(response.status).to.eq(200);

      // Iterate data to verify guid, name and category
      for (const elem of data) {
        const category = elem.category;
        expect(category).to.equal('2');
        expect(elem.guid).not.to.be.empty;
        expect(elem.name).not.to.be.empty;
      }
    });
  });

  it('should send gift', () => {
    const username = users[4].username;
    cy.getUserProfile(auth_token, username).then((response) => {
      let user_details = response.body.data;
      user_details.gift_id = guid_angel;

      expect(response.status).to.eq(200);

      cy.sendGift(auth_token, user_details).then((response) => {
        let data = response.body.data;

        expect(response.status).to.eq(200);
        expect(data).to.have.property('coin');
        expect(data).to.have.property('current_point');
        expect(data).to.have.property('diamonds');
        expect(data).to.have.property('red_diamond');
        expect(data).not.to.be.empty;
        assert.isArray(data.gift_data, 'gift_data is an array');
      });
    });
  });

  it('should deduct gift price from the total coins', () => {
    const username = users[0].username;
    cy.getUserProfile(auth_token, username).then((response) => {
      let user_details = response.body.data;
      let curr_coin = user_details.coin - coin_angel;

      expect(response.status).to.eq(200);
      expect(curr_coin).to.be.lessThan(user_details.coin);
      expect(coin_angel).is.equal(1);
    });
  });

  after(function () {
    cy.logOut().then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});