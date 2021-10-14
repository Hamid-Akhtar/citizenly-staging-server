// Copy the .env.example in the root into a new .env file with your API keys
const { resolve } = require('path');
const { Sequelize, DataTypes, Op } = require('sequelize');
const multer  = require('multer');
const http = require('http');
const url = require('url') ;
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ dest: 'images/', storage });
const env = require('dotenv').config({ path: resolve(__dirname, '../../.env') });
const cors = require('cors');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
// ejs
const ejs = require('ejs');

// Connect to Database
// Sequelize
const sequelize = new Sequelize('mysql://xsean02:WasimAnwar$123123@ozoqodb.cfukutb1nbox.us-west-1.rds.amazonaws.com:3306/citizenly');
//const sequelize = new Sequelize('mysql://root@localhost:3306/citizenly');

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

const User = sequelize.define('representatives', {
  // Model attributes are defined here
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passport: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { updatedAt: false, createdAt: false, initialAutoIncrement: false });

const RepresentativeApplication = sequelize.define('representative_requests', {
  // Model attributes are defined here
  official: {
    type: DataTypes.JSON,
    allowNull: false
  },
  office: {
    type: DataTypes.JSON,
    allowNull: false
  },
  divisions: {
    type: DataTypes.JSON,
    allowNull: false
  },
  divisionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  }
}, { updatedAt: false, createdAt: false, initialAutoIncrement: false });

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Express
const express = require('express');
const app = express();
app.use(cors());
const bodyParser = require('body-parser')

// Stripe
const stripe = require('stripe')("sk_test_51JiIxSBZhITimpA42ygKR1vDsDfb4jigeP1xLrmRLuANNkhR4LIvKxF7lyqogJ6gyEu2VADkfGEbYssSCD7MwWfn00TImIY5Vy");
const StripeResource = require('stripe').StripeResource;

// unique ID's
const { uuid } = require('uuidv4');
const { default: axios } = require('axios');

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
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
        console.log(req.rawBody);
      }
    }
  })
);

app.use(bodyParser.json());

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

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

/**
 * Handler for adding new representatives requests for admin to verify/deny
 */
app.post('/add-new-rep', async (req, res) => {
  try {
    await RepresentativeApplication.create({...req.body, id : uuid()});
    res.status(200).json({message: "Successful Submitted Your Application"});
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
  }
});


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
app.get('/representatives', async (req, res) => {
  try {
    const { searchTerm } = req.query;
    console.log(searchTerm);
    const apiKey = "AIzaSyCIYSUFOcFWiji_MrkceTn2ahh6L4eaxJ4";
    const url = `https://www.googleapis.com/civicinfo/v2/representatives?key=${apiKey}&address=${searchTerm.toLowerCase()}`;
    const resp = await Representative.findOne({
      subQuery: false,
      where: {
        searchTerm: {
          [Op.substring] : `${searchTerm.toLowerCase()}`,
          [Op.like] : `%${searchTerm}`
        }
      }
    });
    if (resp) {
      let divisionsData = resp.response;
      const keysOfDiv = Object.keys(divisionsData.divisions);
      const rep = await RepresentativeApplication.findAll({
        where: {
          divisionId: {
            [Op.in]: keysOfDiv
          }
        }   
      });

      rep.map(r=>{
        if(r) {
          const repre = r.toJSON();
          let officialIndex = divisionsData.officials.push(repre.official) - 1;
          let officeIndex = divisionsData.offices.push(repre.office) - 1;
          if(divisionsData.divisions[repre.divisionId] && divisionsData.divisions[repre.divisionId].officeIndices){
            divisionsData.divisions[repre.divisionId].officeIndices.push(officeIndex);
            divisionsData.offices[officeIndex].officialIndices = [officialIndex];
          }
        }
      });
      
      res.json({ ...divisionsData })
    }
    else {
      const responseFromCivic = await axios.get(url);
      let data = responseFromCivic.data;
      const keysOfDiv = Object.keys(data.divisions);
      await Representative.create({ searchTerm: searchTerm.toLowerCase(), id: searchTerm.toLowerCase(), response: data });
      const rep = await RepresentativeApplication.findAll({
        where: {
          divisionId: {
            [Op.in]: keysOfDiv
          }
        }   
      });
      rep.map(r=>{
        if(r) {
          const repre = r.toJSON();
          let officialIndex = data.officials.push(repre.official) - 1;
          let officeIndex = data.offices.push(repre.office) - 1;
          if(data.divisions[repre.divisionId] && data.divisions[repre.divisionId].officeIndices){
            data.divisions[repre.divisionId].officeIndices.push(officeIndex);
            data.offices[officeIndex].officialIndices = [officialIndex];
          }
        }
      });
      res.json(data);
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
  }
});


/*
 * Handle static assets and other pages
 */
app.use(express.static('./images'));



/*
 * Handle 404 responses

app.use(function (req, res, next) {
  const path = resolve(__dirname, '../client/404.html');
  res.status(404).sendFile(path);
})
 */

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
