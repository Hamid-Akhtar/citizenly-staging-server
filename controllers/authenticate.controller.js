const jwt = require('jsonwebtoken');


module.exports = (passport) => {
    return async (req, res, next) => {
        passport.authenticate(
          'login',
          async (err, user, info) => {
            try {
              if (err) {
                return res.status(400).json({statusCode : 401, message : err});
              }
    
              req.login(
                user,
                { session: false },
                async (error) => {
                  if (error) return next(error);
    
                  const body = { _id: user._id, email: user.email };
                  const token = jwt.sign({ user: body }, process.env.SECRET_JWT);
    
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