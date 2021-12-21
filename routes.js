
const path = require("path");
const multer  = require('multer');
const session = require("express-session");
const civicResponse = require("./controllers/civicResponse.controller");
const { addRep, updateRep, getReps, delRep } = require("./controllers/representatives.controller");
const { addPos, deletePos, getPositions } = require("./controllers/positions.controller");
const { getOcds } = require("./controllers/ocdTemplates.controller");
const { addMember } = require("./controllers/earlyMember.controller");
const { fetchVoterData } = require("./controllers/voter.controller");

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
    
    app.get('/valid', auth(passport), (req, res) => {
      res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
    });
    
    app.use(express.static('./images'));
    
    app.post('/authenticate', auth(passport), (req, res) => {
      res.status(200).json({"statusCode" : 200 ,"message" : "Logged In Successfully!"});
    });
    
    app.post('/add-new-position', passport.authenticate('jwt', { session: false }),addPos);
    
    app.get('/get-positions', passport.authenticate('jwt', { session: false }),getPositions);
    
    app.delete('/del-position/:id', passport.authenticate('jwt', { session: false }),deletePos);

    app.post('/add-new-rep', addRep);

    app.put('/update-rep/:id', passport.authenticate('jwt', { session: false }),updateRep);

    app.get('/get-reps', passport.authenticate('jwt', { session: false }), getReps);
    
    app.delete('/delete-rep/:id', passport.authenticate('jwt', { session: false }),delRep);
    
    app.get('/get-ocds', passport.authenticate('jwt', { session: false }),getOcds);

    app.get('/fetch-voter', fetchVoterData);
    
    app.post('/early-member', addMember);

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
