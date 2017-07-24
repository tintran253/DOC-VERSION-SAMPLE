
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user");

passport.use(new LocalStrategy({ passReqToCallback : true }, function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        //if (!user.validPassword(password)) {
        //    return done(null, false, { message: 'Incorrect password.' });
        //}
        return done(null, user);
    });
}
));

module.exports = passport;
