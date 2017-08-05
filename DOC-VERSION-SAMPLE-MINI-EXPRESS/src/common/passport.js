
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var models = require("../models");



module.exports = function (passport) {

    passport.use('local', new LocalStrategy({ passReqToCallback: true }, function (req, username, password, done) {    
        models.users.findOne({ where: { username: username } }).then(function (user) {
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
    passport.use('auth', new BearerStrategy({ passReqToCallback: true }, function (req, token = "", done) {
        var user = req.session && req.session.passport && req.session.passport.user ? req.session.passport.user : null;
        if (user === null)
            return done(null, false, { message: 'Incorrect username.' });
        return done(null, user);
    }));
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
        models.users.findById(id).then(function (user) {
            done(null, user);
        });
    });

};