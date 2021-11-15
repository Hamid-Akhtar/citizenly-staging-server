const LocalStrategy  =  require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

module.exports = (app, passport) => {
    passport.use(
        'login', new LocalStrategy(
        (username, password, done) => {
                if(username === "admin" && password === "admin"){
                    return done(null, username);
                } else {
                    return done("Unauthorized Access", false);
                }
        }
    ));

    passport.use(
        new JWTstrategy(
          {
            secretOrKey: process.env.SECRET_JWT,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
          },
          async (token, done) => {
            try {
              return done(null, token.user);
            } catch (error) {
              done(error);
            }
          }
        )
      );

    passport.serializeUser(function(user, done) {
        if(user) done(null, user);
    });
      
    passport.deserializeUser(function(id, done) {
        done(null, id);
    });
    
};