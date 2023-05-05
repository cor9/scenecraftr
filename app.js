// Import required modules
const express = require('express');
const { auth } = require('express-openid-connect');
const request = require('request');
const axios = require('axios');

// Create an Express app
const app = express();

// Add authentication middleware
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

// Define a route for the home page
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Define a route for the user profile page, which requires authentication
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Send a POST request to get an access token
const tokenOptions = {
  method: 'POST',
  url: 'https://scenecraftr.us.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"HcpJIWdhBiu9xaXsiYoJ5NnDp8gPvcOj","client_secret":"PzUOZwseT7i0_10kZCEBv8v3TWLYrZOFmWGTbCDF5vNTds0fJnJUr_JwFV0PCcWM","audience":"https://scenecraftr.us.auth0.com/api/v2/","grant_type":"client_credentials"}'
};

request(tokenOptions, function (error, response, body) {
  if (error) throw new Error(error);

  const token = JSON.parse(body).access_token;
  
  // Use the access token to make an authenticated request to an API
  const apiOptions = { 
    method: 'GET',
    url: 'http://path_to_your_api/',
    headers: { authorization: `Bearer ${token}` },
  };
  
  axios(apiOptions)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

// Export the Express app
export default app;
