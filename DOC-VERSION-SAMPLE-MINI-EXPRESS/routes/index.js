'use strict';
var express = require('express');
var router = express.Router();
var passport = require("../src/common/auth");
var Docs = require("../src/models/docs");
var Users = require("../src/models/user");
var DocsVersion = require("../src/models/docs-version");

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
        DocsVersion.findAll({
            docsId: id,
            order: [
                ['updatedAt', 'DESC']
            ]
        }).then((resl) => {
            if (resl.length > 0)
                result.content = resl[0].content
            res.render('compose', { title: 'compose', result: result });
        })
        //Q.nfcall(fs.readdir, testFolder)
        //    .then(function (results) {
        //        console.log(results);
        //        res.render('compose', { title: 'compose', files: results });
        //    });
    });
});

router.post('/compose', function (req, res) {
    var id = req.body.id;
    const testFolder = './upload/';
    var result = [];

    DocsVersion.sync().then(() => {
        return DocsVersion.create({
            docsId: id,
            updatedBy: req.session.passport.user.id,
            content: req.body.content
        }).then((rs) => {
            Docs.findById(id).then(function (result) {
                result.content = rs.content;
                res.render('compose', { title: 'compose', result: result });
            });
            //res.render('compose', { title: 'compose', result: result });
        });
    });

    //Docs.update({
    //    content: req.body.content,
    //    title: req.body.title
    //}, {
    //        where: {
    //            id: id
    //        }
    //    }).then(function (result) {
    //        Docs.findById(id).then(function (result) {
    //            console.log(result);
    //            res.render('compose', { title: 'compose', result: result });
    //        });
    //    });
});

router.get('/login', function (req, res) {
    res.render('login')
});

router.get('/logout', function (req, res) {
    req.logout();
    res.render('index')
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

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
}
);

router.get('/history/:id', function (req, res) {
    return Docs.findById(req.params.id)
        .then((docs) => {
            return DocsVersion.findAll({
                docsId: req.params.id,
                order: [
                    ['updatedAt', 'DESC']
                ]
            }).then(function (resl) {
                res.render("docs/history", { result: docs, histories: resl });
            });
        })
}
);

module.exports = router;
