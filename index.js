// Copy the .env.example in the root into a new .env file with your API keys
const { resolve } = require('path');
const env = require('dotenv').config({ path: resolve(__dirname, '../../.env') });
const cors = require('cors');
// ejs
const ejs = require('ejs');

// Express
const express = require('express');
const app = express();
app.use(cors());
const bodyParser = require('body-parser')

// Stripe
const stripe = require('stripe')("sk_test_51JiIxSBZhITimpA42ygKR1vDsDfb4jigeP1xLrmRLuANNkhR4LIvKxF7lyqogJ6gyEu2VADkfGEbYssSCD7MwWfn00TImIY5Vy");
const StripeResource = require('stripe').StripeResource;

// unique ID's
const { uuid }= require('uuidv4');


const VerificationSession = StripeResource.extend({
  create: StripeResource.method({
    method: 'POST',
    path: 'identity/verification_sessions',
  }),
  get: StripeResource.method({
    method: 'GET',
    path: 'identity/verification_sessions/{verificationSessionId}',
  })
});
const verificationSession = new VerificationSession(stripe);

/*
 * Express middleware
 */
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
        console.log(req.rawBody);
      }
    }
  })
);

app.use(bodyParser.json());


const respondToClient = (error, responseData, res) => {
  if (error) {
    console.error('\nError:\n', error.raw);
    res.send({error});
  } else if (responseData) {
    if (responseData.id) {
      res.send({session: responseData});
    } else {
      res.status(500).send({
        error: {
          message: 'VerificationSession contained no `id` field'
        },
      });
    }
  }
};

/*
 * Handler for creating the VerificationSession for Stripe.js
 */
app.post('/create-verification-session', async (req, res) => {
  const verificationSessionParams = {
    type: 'document',
    options: {
      document: {
        require_id_number: true,
        require_matching_selfie: true,
      },
    },
    metadata: {
      userId: uuid(), // optional: pass a user's ID through the VerificationSession API
    },
  }

  verificationSession.create(verificationSessionParams, (error, responseData) => {
    respondToClient(error, responseData, res);
  });
});

/*
 * Handler for creating the VerificationSession redirect link
 */
app.post('/create-verification-session-redirect', async (req, res) => {
  const domain = req.get('origin') || req.header('Referer');

  const verificationSessionParams = {
    type: 'document',
    options: {
      document: {
        require_id_number: true,
        require_matching_selfie: true,
      },
    },
    return_url: `${domain}/next-step`,
    metadata: {
      userId: uuid(), // optional: pass a user's ID through the VerificationSession API
    },
  }

  verificationSession.create(verificationSessionParams, (error, responseData) => {
    respondToClient(error, responseData, res);
  });
});

/*
 * Handler for retrieving a VerificationSession
 */
app.get('/get-verification-session/:verificationSessionId', async (req, res) => {
  const {verificationSessionId} = req.params;
  verificationSession.get(verificationSessionId, (error, responseData) => {
    respondToClient(error, responseData, res);
  });
});

/*
 * Handle static assets and other pages
 */
app.use(express.static('./client'));

/*
 * Handle 404 responses
 */
app.use(function (req, res, next) {
  const path = resolve(__dirname, '../client/404.html');
  res.status(404).sendFile(path);
})


// Start server
const localPort = process.env.PORT || 80;
const server = require('http').createServer(app);
server.listen(localPort, () => console.log(`Node server listening on port ${localPort}!`));
