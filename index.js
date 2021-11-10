const env = require('dotenv').config();
const { Sequelize, DataTypes, Op } = require('sequelize');
const multer  = require('multer');
const path = require("path");
const session = require("express-session");
const civicResponse = require("./services/civicResponse.service");
const { addRep, updateRep, getReps, delRep } = require("./services/representatives.service");
const { addPos, updatePos, deletePos, getPositions } = require("./services/positions.service");
const { getOcds } = require("./services/ocdTemplates.service");
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ dest: 'images/', storage });
const cors = require('cors');
const passport = require('passport');

const sequelize = new Sequelize(process.env.MYSQL_URL);
//const sequelize = new Sequelize('mysql://root@localhost:3306/citizenly');
/*
const Representative = sequelize.define('representatives_response', {
  // Model attributes are defined here
  searchTerm: {
    type: DataTypes.STRING,
    allowNull: false
  },
  response: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, { updatedAt: false, createdAt: false, initialAutoIncrement: false });
*/

// Express
const express = require('express');
const app = express();
app.use(cors());

require("./passport")(app, passport);

const auth = () => {
  return async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err) {
              return res.status(400).json({statusCode : 400, message : err});
            }
  
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
  
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, "TOP_SECRET");
  
                return res.json({ token });
              }
            );
          } catch (error) {
              return res.status(500).json({statusCode : 500, message : err});
          }
        }
      )(req, res, next);
    }
}

// Stripe
const stripe = require('stripe')("sk_test_51JiIxSBZhITimpA42ygKR1vDsDfb4jigeP1xLrmRLuANNkhR4LIvKxF7lyqogJ6gyEu2VADkfGEbYssSCD7MwWfn00TImIY5Vy");
const StripeResource = require('stripe').StripeResource;

// unique ID's
const { uuid } = require('uuidv4');

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

app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    }
  })
);
app.use(session({secret: "secret"}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.post('/authenticate', auth() , (req, res) => {
  res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
});

app.get('/valid', passport.authenticate('jwt', { session: false }) , (req, res) => {
  res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
});

const respondToClient = (error, responseData, res) => {
  if (error) {
    console.error('\nError:\n', error.raw);
    res.send({ error });
  } else if (responseData) {
    if (responseData.id) {
      res.send({ session: responseData });
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
 * Handle static assets and other pages
 */
app.use(express.static('./images'));

/**
 * Handler for adding new position for office
 */
app.post('/add-new-position', passport.authenticate('jwt', { session: false }), addPos);

app.put('/update-position/:id', passport.authenticate('jwt', { session: false }), updatePos);

app.get('/get-positions', passport.authenticate('jwt', { session: false }), getPositions);

/**
 * Handler for deleting representatives
 */
 app.delete('/del-position/:id', passport.authenticate('jwt', { session: false }), deletePos);

/**
 * Handler for adding new representatives requests for admin to verify/deny
 */
app.post('/add-new-rep', passport.authenticate('jwt', { session: false }), addRep);

/**
 * Handler for updating representatives(only accessible by admin)
 */
 app.put('/update-rep/:id', passport.authenticate('jwt', { session: false }), updateRep);

/**
 * Handler for getting representatives
 */
app.get('/get-reps', passport.authenticate('jwt', { session: false }), getReps);

/**
 * Handler for deleting representatives
 */
app.delete('/delete-rep/:id', passport.authenticate('jwt', { session: false }), delRep);

app.get('/get-ocds', passport.authenticate('jwt', { session: false }), getOcds);

//
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
  const { verificationSessionId } = req.params;
  verificationSession.get(verificationSessionId, (error, responseData) => {
    respondToClient(error, responseData, res);
  });
});

app.post("/upload_image", upload.single('photo'), async (req, res)=>{
  var hostname = req.headers.host; 
  const uri = `http://${hostname}/${req.file.filename}`;
  res.status(200).json({photo_url: uri});
});

/**
 * Call Civics API
 */
app.get('/representatives', civicResponse);

// Start server
const localPort = process.env.PORT || 8080;
const server = require('http').createServer(app);
server.listen(localPort, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    console.log(`Node server listening on port ${localPort}!`);
  }
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
