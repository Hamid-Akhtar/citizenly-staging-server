
const path = require("path");
const multer  = require('multer');
const session = require("express-session");
const civicResponse = require("./controllers/civicResponse.controller");
const { addRep, updateRep, getReps, delRep } = require("./controllers/representatives.controller");
const { addPos, updatePos, deletePos, getPositions } = require("./controllers/positions.controller");
const { getOcds } = require("./controllers/ocdTemplates.controller");
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  });
const upload = multer({ dest: 'images/', storage });

module.exports = (app, passport, express) => {
  const auth = require("./controllers/authenticate.controller");

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
    require("./passport")(app, passport);
    app.post('/authenticate', auth(passport), (req, res) => {
      res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
    });
    
    app.get('/valid' , (req, res) => {
      res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
    });
    
    /*
     * Handle static assets and other pages
     */
    app.use(express.static('./images'));
    
    /**
     * Handler for adding new position for office
     */
    app.post('/add-new-position', addPos);
    
    app.put('/update-position/:id', updatePos);
    
    app.get('/get-positions', getPositions);
    
    /**
     * Handler for deleting representatives
     */
     app.delete('/del-position/:id', deletePos);
    
    /**
     * Handler for adding new representatives requests for admin to verify/deny
     */
    app.post('/add-new-rep', addRep);
    
    /**
     * Handler for updating representatives(only accessible by admin)
     */
     app.put('/update-rep/:id', updateRep);
    
    /**
     * Handler for getting representatives
     */
    app.get('/get-reps', getReps);
    
    /**
     * Handler for deleting representatives
     */
    app.delete('/delete-rep/:id', delRep);
    
    app.get('/get-ocds', getOcds);
    
    app.post("/upload_image", upload.single('photo'), async (req, res)=>{
      var hostname = req.headers.host; 
      const uri = `http://${hostname}/${req.file.filename}`;
      res.status(200).json({photo_url: uri});
    });
    
    /**
     * Call Civics API
     */
    app.get('/representatives', civicResponse);
}
