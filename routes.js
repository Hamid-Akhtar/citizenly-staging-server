
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
    app.post('/authenticate', auth() , (req, res) => {
      res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
    });
    
    app.get('/valid', passport.authenticate('jwt', { session: false }) , (req, res) => {
      res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
    });
    
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
    app.post('/add-new-rep', addRep);
    
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
