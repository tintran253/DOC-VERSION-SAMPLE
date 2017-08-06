'use strict';
//libraries
var express = require('express'),
    passport = require("passport"),
    router = express.Router(),
    http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    Q = require("q"),
    diff = require("diff"),
    fs = require('fs');

//custom
var requestHandler = require("../src/common/requestHandler"),
    responseHandler = require("../src/common/responseHandler"),
    models = require("../src/models");


//define
router.get('/',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
        if (!req.query.q)
            models.users.findAll().then(function (users) {
                res.render('auth/view', { users: users });
            });
        else {
            models.users.findAll({
                where: {
                    username: { $like: '%' + req.query.q + '%' }
                }
            }).then(function (users) {
                res.render('auth/view', { users: users });
            });
        }
    }
);
//router.get('/:q',
//    requestHandler,
//    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
//    responseHandler,
//    function (req, res) {
//        q = req.params.q;
//        models.users.findAll({
//            where: {
//                username: { $like: '%' + q + '%' }
//            }
//        }).then(function (users) {
//            res.render('auth/view', { users: users });
//        });
//    }
//);

router.get('/register', requestHandler, passport.authenticate('auth'), responseHandler, function (req, res) {
    models.sides.findAll().then(function (sides) {
        res.render('auth/register', { sides: sides })
    });
});

router.post('/register', requestHandler, passport.authenticate('auth'), responseHandler, function (req, res, next) {
    return models.users.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        sides: req.body.sides
    }).then(function () {
        res.redirect('/users')
    })
});

router.get('/login', function (req, res) {
    res.render('auth/login')
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.render('home/index');
    });
});

router.post('/login', passport.authenticate('local'), responseHandler, function (req, res) {
    res.redirect("/");
});


module.exports = router;
