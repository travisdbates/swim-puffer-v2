module.exports = {
  auth: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirectUri:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/callback'
        : process.env.NODE_ENV === 'staging'
        ? 'https://staging.swimpufferfish.com/callback'
        : process.env.NODE_ENV === 'production'
        ? 'https://swimpufferfish.com/callback'
        : process.env.REACT_APP_AUTH0_REDIRECT,
    responseType: 'token id_token',
    scope: 'openid'
  }
};
