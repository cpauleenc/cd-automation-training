describe("Kumu Live Web - Login via Facebook", () => {
  let user_guid, otp, data, fb_oauth_provider, fb_oauth_id;

  it("should verify Facebook account upon login", () => {
    cy.fixture('providers.json').then((provider) => {
      fb_oauth_provider = provider.facebook.oauth_provider;
      fb_oauth_id = provider.facebook.oauth_id;

      expect(fb_oauth_provider).to.equal('facebook');
      expect(fb_oauth_id).to.equal('103973238771307');
    });
  })

  it("should login via Facebook using OAuth ", () => {
    cy.OAuthLogin(fb_oauth_provider, fb_oauth_id).then((response) => {
      cy.log('response: ', response);
      data = response.body.data;
      user_guid = response.body.data.user_guid;
      otp = response.body.data.otp;
      expect(response.status).to.equal(200);
      expect(data).to.have.property('user_guid');
      expect(data).to.have.property('otp');
      expect(data.user_guid).not.to.be.empty
      expect(data.otp).not.to.be.empty
    });
  });

  it("should generate OAuth token via Facebook", () => {
    cy.OAuthToken(user_guid, otp).then((response) => {
      data = response.body.data;
      expect(response.status).to.equal(200);
      expect(data).to.have.property('access_token');
      expect(data.access_token).not.to.be.empty
    });
  });
});
  