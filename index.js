require('dotenv').config();
const sequelize = require("./models/sequalize");

const cors = require('cors');
const passport = require('passport');

// Express
const express = require('express');
const app = express();

const allowlist = ['http://citizenreps.s3-website-us-east-1.amazonaws.com', 'http://citizenlyadmin.s3-website-us-east-1.amazonaws.com'];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  const isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

  if (isDomainAllowed) {
    // Enable CORS for this request
    corsOptions = { origin: true }
  } else {
    // Disable CORS for this request
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate));
require("./routes")(app, passport, express);

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
