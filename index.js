import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Auth0ProviderWithHistory from './auth0-provider-with-history';
const { auth } = require('express-openid-connect');
const express = require('express');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://scenecraftr.com',
  clientID: 'RlTJfPJfBprVZ1GT0h1JB4pOBXsKwQ7a',
  issuerBaseURL: 'https://scenecraftr.us.auth0.com'
};

const app = express();
app.use(auth(config));

ReactDOM.render(
  <Auth0ProviderWithHistory>
    <App />
  </Auth0ProviderWithHistory>,
  document.getElementById('root')
);

reportWebVitals();
