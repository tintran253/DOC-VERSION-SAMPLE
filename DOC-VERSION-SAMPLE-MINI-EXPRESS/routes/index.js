'use strict';
var express = require('express');
var router = express.Router();
var passport = require("passport");
var models = require("../src/models");
var Q = require("q");
var diff = require("diff");
var HtmlDiffer = require('html-differ').HtmlDiffer;

var requestHandler = require("../src/common/requestHandler");
var responseHandler = require("../src/common/responseHandler");

router.get('/', function (req, res) {
    models.docs.findAll().then(function (result) {
        res.render('index', { title: 'DOCV', result: result, user: req.session && req.session.passport && req.session.passport.user ? req.session.passport.user : null });
    })
});

router.get('/edit/:id',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
        var id = req.params.id;
        var result = [];

        models.docs.findById(id).then(function (result) {
            models.docsVersions.findAll({
                where: { docsId: id },
                order: [
                    ['updatedAt', 'DESC']
                ]
            }).then((resl) => {
                if (resl.length > 0)
                    result.content = resl[0].content
                res.render('docs/edit', { title: 'edit', result: result });
            })
        });
    });

router.post('/edit', 
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
    var id = req.body.id;
    const testFolder = './upload/';
    var result = [];

    return models.docsVersions.create({
        docsId: id,
        updatedById: req.user.id,
        content: req.body.content
    }).then((rs) => {
        models.docs.findById(id).then(function (result) {
            result.content = rs.content;
            res.render('docs/edit', { title: 'edit', result: result });
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login')
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.render('index');
    });
});

router.post('/login', passport.authenticate('local'), responseHandler, function (req, res) {
    res.redirect("/");
});

router.get('/register', function (req, res) {
    res.render('auth/register')
});

router.post('/register', function (req, res, next) {
    return models.users.create({
        username: req.body.username,
        password: req.body.password
    }).then(function () {
        next();
    })
}, passport.authenticate('local', { successRedirect: '/' }), responseHandler);

router.get('/history/:id',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
        models.docs.findById(req.params.id)
            .then((docs) => {
                return models.docsVersions.findAll({
                    where: { docsId: req.params.id },
                    order: [
                        ['updatedAt', 'DESC']
                    ],
                    include: ['updatedBy']
                }).then(function (resl) {
                    res.render("docs/history", { result: docs, histories: resl });
                });
            })
    });

router.get('/view/:id',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
        return models.docsVersions.findById(req.params.id)
            .then((docsVersion) => {
                res.render("docs/view", { result: docsVersion });
            });
    });

router.get('/compare/:id/vs/:id2',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
        return Q.all([models.docsVersions.findById(req.params.id), models.docsVersions.findById(req.params.id2)])
            .spread(function (result1, result2) {

                var options = {
                    ignoreAttributes: [],
                    compareAttributesAsJSON: [],
                    ignoreWhitespaces: true,
                    ignoreComments: true,
                    ignoreEndTags: false,
                    ignoreDuplicateAttributes: true
                };
                var htmlDiffer = new HtmlDiffer(options);

                var diffResult = diff.diffChars(result2.content, result1.content, { ignoreCase: false });
                var result = '';
                var result01 = "";
                var result02 = "";
                diffResult.forEach(function (part) {
                    var span = null;
                    var state = part.added ? 2 :
                        part.removed ? 1 : 0;
                    var color = part.added ? 'background-color:green' :
                        part.removed ? 'background-color:red' : '';
                    if (state === 0) {
                        result01 += part.value;
                        result02 += part.value;
                    }
                    if (state === 2) {
                        span = "<span style='" + color + "'>";
                        span += part.value;
                        result02 += span + "</span>";
                    } else {
                        result02 += "<span style='background-color:green'></span>";
                    }
                    if (state === 1) {
                        span = "<span style='" + color + "'>";
                        span += part.value;
                        result01 += span + "</span>";
                    }
                    else {
                        result01 += "<span style='background-color:red'></span>";
                    }
                });

                res.render("docs/compare", { result1: result01, result2: result02, docsId: result1.docsId });
            });
    });

module.exports = router;
