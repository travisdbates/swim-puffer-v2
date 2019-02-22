module.exports = {
  auth: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirectUri:
      process.env.REACT_APP_AUTH0_REDIRECT || 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid'
  }
};
