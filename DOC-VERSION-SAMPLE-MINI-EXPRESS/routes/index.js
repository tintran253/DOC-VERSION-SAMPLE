'use strict';
var express = require('express');
var router = express.Router();
var passport = require("../src/common/passport");
var Docs = require("../src/models/docs");
var Users = require("../src/models/user");
var DocsVersion = require("../src/models/docs-version");
var Q = require("q");
var diff = require("diff");
var HtmlDiffer = require('html-differ').HtmlDiffer;
/* GET home page. */
router.get('/', function (req, res) {
    Docs.sync().then(() => {
        Docs.findAll().then(function (result) {
            res.render('index', { title: 'DOCV', result: result, user: req.session && req.session.passport && req.session.passport.user ? req.session.passport.user : null });
        })
    });
});

router.get('/compose/:id', function (req, res) {
    var id = req.params.id;
    const testFolder = './upload/';
    var result = [];

    Docs.findById(id).then(function (result) {
        DocsVersion.sync().then(() => {
            DocsVersion.findAll({
                where: { docsId: id },
                order: [
                    ['updatedAt', 'DESC']
                ]
            }).then((resl) => {
                if (resl.length > 0)
                    result.content = resl[0].content
                res.render('compose', { title: 'compose', result: result });
            })
        })
    });
});

router.post('/compose', function (req, res) {
    var id = req.body.id;
    const testFolder = './upload/';
    var result = [];

    DocsVersion.sync().then(() => {
        return DocsVersion.create({
            docsId: id,
            updatedById: req.session.passport.user.id,
            content: req.body.content
        }).then((rs) => {
            Docs.findById(id).then(function (result) {
                result.content = rs.content;
                res.render('compose', { title: 'compose', result: result });
            });
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login')
});

router.get('/logout', function (req, res) {
    req.logout();
    res.render('index')
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', function (req, res) {
    res.render('auth/register')
});

router.post('/register', function (req, res) {
    return Users.sync()
        .then(() => {
            return Users.create({
                username: req.body.username,
                password: req.body.password
            });
        }).then((user) => {
            if (user)
                res.render('login')
        });
});

router.get('/history/:id', function (req, res) {
    return Docs.sync().then(() => {
        Docs.findById(req.params.id)
            .then((docs) => {
                DocsVersion.sync().then(() => {
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
            })
    });
});

router.get('/view/:id', function (req, res) {
    return DocsVersion.findById(req.params.id)
        .then((docsVersion) => {
            res.render("docs/view", { result: docsVersion });
        });
});

router.get('/compare/:id/vs/:id2', function (req, res) {
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
            //var diffResult = htmlDiffer.diffHtml(result1.content, result2.content);

            var diffResult = diff.diffChars(result2.content, result1.content, { ignoreCase: false });
            //var i = 0;
            var result = '';

            var result01 = "";
            var result02 = "";
            diffResult.forEach(function (part) {
                var span = null;
                var state = part.added ? 2 :
                    part.removed ? 1 : 0;
                //var color = part.added ? 'green' :
                //    part.removed ? 'red' : 'grey';
                //result += state + part.value
                //console.log(i++, state, part.value);
                // green for additions, red for deletions 
                // grey for common parts 
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
                //span = "<span style='" + color + "'>";
                //span += part.value;
                //result += span + "</span>";
                //fragment.appendChild(span);
            });

            res.render("docs/compare", { result1: result01, result2: result02, docsId: result1.docsId });
        });
});

module.exports = router;
