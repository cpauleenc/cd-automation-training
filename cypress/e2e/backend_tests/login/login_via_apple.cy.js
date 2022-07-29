describe("Kumu Live Web - Login via Apple Id", () => {
  let user_guid, otp, data, apple_oauth_provider, apple_oauth_id;

  it("should verify Apple account upon login", () => {
    cy.fixture('providers.json').then((provider) => {
      apple_oauth_provider = provider.apple.oauth_provider;
      apple_oauth_id = provider.apple.oauth_id;

      expect(apple_oauth_provider).to.equal('apple');
      expect(apple_oauth_id).to.equal('000631.00cb3c871c15486db3c5f2f60d5eee3d.0008');
    });
  })

  it("should login via Apple using OAuth ", () => {
    cy.OAuthLogin(apple_oauth_provider, apple_oauth_id).then((response) => {
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
    