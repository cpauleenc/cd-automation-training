describe('[API] Kumu Live Web - Login via Username', () => {
  let data;

  it('should send verification message', () => {
    cy.sendVerifySms().then((response) => {
      data = response.body.data;
      
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('A verification code has been sent to : xxxxxxxxx611');
      expect(data).to.have.property('request_id').to.equal('xxxxxx');
    });
  });

  it('should logged in the user via username', () => {
    cy.generateUserOAuthToken().then((response) => {
      data = response.body.data;
      
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Request Success');
      expect(data).to.have.property('token_type').to.equal('Bearer');
      expect(data).to.have.property('expires_in').to.equal(7200);
      expect(data).to.have.property('scope').to.equal('all');
      expect(data).to.have.property('access_token');
      expect(data).to.have.property('refresh_token');
      expect(data.access_token).not.to.be.empty;
    });
  });
});
  