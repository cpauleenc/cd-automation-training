describe('[API] Kumu Live Web - Login via Google', () => {
  let user_guid, otp, data, google_oauth_provider, google_oauth_id;

  it('should verify Google account upon login', () => {
    cy.fixture('providers.json').then((provider) => {
      google_oauth_provider = provider.google.oauth_provider;
      google_oauth_id = provider.google.oauth_id;

      expect(google_oauth_provider).to.equal('google');
      expect(google_oauth_id).to.equal('112792426208437278249');
    });
  })

  it('should login via Google using OAuth ', () => {
    cy.OAuthLogin(google_oauth_provider, google_oauth_id).then((response) => {
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

  it('should generate OAuth token via Google', () => {
    cy.OAuthToken(user_guid, otp).then((response) => {
      data = response.body.data;

      expect(response.status).to.equal(200);
      expect(data).to.have.property('access_token');
      expect(data.access_token).not.to.be.empty
    });
  });
});
    