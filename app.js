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

var request = require("request");

var options = { method: 'POST',
  url: 'https://scenecraftr.us.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"HcpJIWdhBiu9xaXsiYoJ5NnDp8gPvcOj","client_secret":"PzUOZwseT7i0_10kZCEBv8v3TWLYrZOFmWGTbCDF5vNTds0fJnJUr_JwFV0PCcWM","audience":"https://scenecraftr.us.auth0.com/api/v2/","grant_type":"client_credentials"}' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InV4dFE1T3hIVFNaTGdjWFhrUFFZNSJ9.eyJpc3MiOiJodHRwczovL3NjZW5lY3JhZnRyLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJIY3BKSVdkaEJpdTl4YVhzaVlvSjVObkRwOGdQdmNPakBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9zY2VuZWNyYWZ0ci51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY4MzI0ODQzOSwiZXhwIjoxNjgzMzM0ODM5LCJhenAiOiJIY3BKSVdkaEJpdTl4YVhzaVlvSjVObkRwOGdQdmNPaiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.q44n2RSjw_BzGTv2EvmK3pO03gHmD25VgDByu_Xe4vX5-QMZ9hm7Nk6hZZLXsmtteLjzAdGZcQXI0hvUjp2x5FgRQOHYyo1dVlWsvNsSofp9jLISuhKR4lQHnJrdQZjaR6wg8J7EGLNIX8BpcMc0d3ZXk_Nw579js1cwqPaV1z2eTmauIWoOcuecidT_WqG717BRnxcRN132BCvylT1jCkYDjB98moTMJw9Izd8PZNw_DuCg-eeIgV9l44kiYde8xFeaXhl-aaYTSWIQcLPH02zgX8aB_LTXK8LibvCCH1exPHQJ5apX-dDPoO0QMAdhGjetadRYT87bedl7Q-w28g

const axios = require("axios");

const options = { 
  method: "GET",
  url: "http://path_to_your_api/",
  headers: { "authorization": "Bearer TOKEN" },
};

axios(options)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });

  import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}