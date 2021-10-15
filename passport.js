const  LocalStrategy  =  require('passport-local').Strategy;

module.exports = (app, passport) => {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            if(username === "admin" && password === "admin"){
                return done(null, username);
            } else {
                return done("unauthorized access", false);
            }
        }
    ));

    passport.serializeUser(function(user, done) {
        if(user) done(null, user);
    });
      
    passport.deserializeUser(function(id, done) {
        done(null, id);
    });
};