const express = require('express');
const Airtable = require('airtable');
const bcrypt = require('bcrypt');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');
const bodyParser = require('body-parser');
const { auth, requiresAuth } = require('express-openid-connect');

const app = express();
const port = process.env.PORT || 3000;

// Auth0 configuration
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: 'YOUR_AUTH0_SECRET',
  baseURL: 'http://localhost:3000',
  clientID: 'YOUR_AUTH0_CLIENT_ID',
  issuerBaseURL: 'YOUR_AUTH0_ISSUER_BASE_URL',
};

// Initialize Auth0 middleware
app.use(auth(authConfig));

// Airtable configuration
Airtable.configure({
  apiKey: 'keyfQ87Zzr8iuZajP',
});
const base = Airtable.base('app5LeVMEUfosfPGL');

// Middleware for parsing request body
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Protected route example
app.get('/protected', requiresAuth(), (req, res) => {
  res.send('This is a protected route. You are logged in!');
});

// User registration route
app.post('/register', async (req, res) => {
  // Validate user input
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  // Check for a valid email format
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  try {
    // Check if a user with the same email already exists in your Airtable base
    const existingUsers = await base('Users').select({
      filterByFormula: `email = "${email}"`,
    }).firstPage();

    if (existingUsers.length > 0) {
      return res.status(400).send('A user with this email already exists');
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // If the user does not exist, create a new record in the Airtable base with the user's information
    await base('Users').create([
      {
        fields: {
          email,
          password: hashedPassword,
          // Add other fields as needed
          'Remaining Uses': 1, // Set the initial 'Remaining Uses' to 1
          // You can also initialize the other fields, such as 'Stripe Customer ID', 'Stripe Subscription ID', etc., to an empty string or null, if needed.
        },
      },
    ]);

    // Send a response to the front-end indicating whether the registration was successful
    res.status(201).send('User registration successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during registration');
  }
});


// User login route
app.post('/login', async (req, res) => {
  // ...
});

// Stripe webhook route
app.post('/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  // ...
});

// Data retrieval route
app.post('/data', requiresAuth(), async (req, res) => {
  try {
    // Retrieve the user's usage information from the Airtable base
    const user = await getUserFromAirtable(req.oidc.user.email);

    // Check if the user has created a scene within the last 24 hours
    const now = new Date();
    const lastSceneCreated = new Date(user.fields['Last Scene Created']);
    const oneDay = 24 * 60 * 60 * 1000;
    const timeDiff = now - lastSceneCreated;

    if (timeDiff <= oneDay) {
      // If they have created a scene within the last 24 hours, check the count
      if (user.fields['Free Scenes Today'] >= 1) {
        return res.status(403).send('You can only create one scene per day for free');
      }
    } else {
      // If it's a new day, reset the 'Free Scenes Today' counter
      await base('Users').update([
        {
          id: user.id,
          fields: {
            'Free Scenes Today': 0,
          },
        },
      ]);
    }

    // Perform the necessary API call(s) to generate the content from the prompt
    // ...

    // Update the user's 'Last Scene Created' and increment the 'Free Scenes Today' counter
    await base('Users').update([
      {
        id: user.id,
        fields: {
          'Last Scene Created': now,
          'Free Scenes Today': user.fields['Free Scenes Today'] + 1,
        },
      },
    ]);

    // Send the generated content as a response to the front-end
    // ...
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during data retrieval');
  }
});


// Helper function to determine the usage limit based on the subscription
function getUsageLimitFromSubscription(planId) {
  // ...
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});