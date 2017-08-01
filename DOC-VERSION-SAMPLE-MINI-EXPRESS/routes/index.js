'use strict';
var express = require('express');
var router = express.Router();
var passport = require("passport");
var Docs = require("../src/models/docs");
var Users = require("../src/models/user");
var DocsVersion = require("../src/models/docs-version");
var Q = require("q");
var diff = require("diff");
var HtmlDiffer = require('html-differ').HtmlDiffer;

var requestHandler = require("../src/common/requestHandler");
router.get('/', function (req, res) {
    Docs.findAll().then(function (result) {
        res.render('index', { title: 'DOCV', result: result, user: req.session && req.session.passport && req.session.passport.user ? req.session.passport.user : null });
    })
});

router.get('/edit/:id',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    function (req, res) {
        var id = req.params.id;
        var result = [];

        Docs.findById(id).then(function (result) {
            DocsVersion.findAll({
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
    function (req, res) {
    var id = req.body.id;
    const testFolder = './upload/';
    var result = [];

    return DocsVersion.create({
        docsId: id,
        updatedById: req.user.id,
        content: req.body.content
    }).then((rs) => {
        Docs.findById(id).then(function (result) {
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

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect("/");
});

router.get('/register', function (req, res) {
    res.render('auth/register')
});

router.post('/register', function (req, res, next) {
    return Users.create({
        username: req.body.username,
        password: req.body.password
    }).then(function () {
        next();
    })
}, passport.authenticate('local', { successRedirect: '/' }));

router.get('/history/:id',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    function (req, res) {
        Docs.findById(req.params.id)
            .then((docs) => {
                return DocsVersion.findAll({
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
    function (req, res) {
        return DocsVersion.findById(req.params.id)
            .then((docsVersion) => {
                res.render("docs/view", { result: docsVersion });
            });
    });

router.get('/compare/:id/vs/:id2',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    function (req, res) {
        return Q.all([DocsVersion.findById(req.params.id), DocsVersion.findById(req.params.id2)])
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
