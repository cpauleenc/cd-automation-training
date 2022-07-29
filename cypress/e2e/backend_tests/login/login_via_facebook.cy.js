describe("Kumu Live Web - Login via Facebook", () => {
  let user_guid, otp, data;

  it("should login using OAuth", () => {
    cy.OAuthLogin().then((response) => {
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

  it("should generate OAuth token", () => {
    cy.OAuthToken(user_guid, otp).then((response) => {
      data = response.body.data;
      expect(response.status).to.equal(200);
      expect(data).to.have.property('access_token');
      expect(data.access_token).not.to.be.empty
    });
  });
});
  