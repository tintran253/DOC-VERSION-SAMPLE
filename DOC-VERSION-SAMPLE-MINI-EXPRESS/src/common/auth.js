
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user");

passport.use(new LocalStrategy({ passReqToCallback: true }, function (req, username, password, done) {
    User.findOne({ username: username }).then(function (user) {
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.password || user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
}
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {        
        done(null, user);
    });
});

module.exports = passport;
