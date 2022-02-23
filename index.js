require('dotenv').config();
const sequelize = require("./models/sequalize");
const sequelize2 = require("./models/sequelize2");

const cors = require('cors');
const passport = require('passport');

// Express
const express = require('express');
const app = express();

const allowlist = ['http://citizenreps.s3-website-us-east-1.amazonaws.com', 
                   'http://www.citizenly.com',
                   'http://citizenly.com',
                   'http://citizenlyadmin.s3-website-us-east-1.amazonaws.com', 
                   'http://citizenlyui.s3-website-us-east-1.amazonaws.com',
                    'https://dev.citizenopolis.com',
                    'http://dev.citizenopolis.com',
                    'http://citizenly.com.s3-website-us-east-1.amazonaws.com'
                  ];
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

app.use(cors());
require("./routes")(app, passport, express);

// Start server
const localPort = process.env.PORT || 443;
const server = require('http').createServer(app);
server.listen(localPort, async () => {
  try {
    await sequelize.authenticate();
    await sequelize2.authenticate();
    console.log('Connection has been established successfully.');
    console.log(`Node server listening on port ${localPort}!`);
  }
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
