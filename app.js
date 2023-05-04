const express = require('express');
const { auth } = require('express-openid-connect');

const app = express();

app.use(
  auth({
    issuerBaseURL: 'https://scenecraftr.us.auth0.com',
    baseURL: 'https://scenecraftr.com',
    clientID: 'scenecraftr.us.auth0.com',
    secret: 'yYZjQhBQYsOgZAmHT7hjlVg70MZNApGxVfX-Sj44YqvGmdOHMoqLOZVHR0oGbkBY',
    authRequired: false,
    auth0Logout: true,
    routes: {
      login: '/login',
      callback: '/callback',
      logout: '/logout',
      postLogoutRedirect: 'https://scenecraftr.com'
    }
  })
);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

const { requiresAuth } = require('express-openid-connect');

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});
