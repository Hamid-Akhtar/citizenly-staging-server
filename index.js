require('dotenv').config();
const sequelize = require("./models/sequalize");

const cors = require('cors');
const passport = require('passport');

// Express
const express = require('express');
const app = express();
app.use(cors());

/*
 * Express middleware
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
*/
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
