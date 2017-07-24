'use strict';
var express = require('express');
var router = express.Router();
var passport = require("../src/common/auth");
var Docs = require("../src/models/docs");

/* GET home page. */
router.get('/', function (req, res) {
    Docs.findAll().then(function (result) {
        res.render('index', { title: 'DOCV', result: result });
    })
});


router.get('/compose/:id', function (req, res) {
    var id = req.params.id;
    const testFolder = './upload/';
    var result = [];

    Docs.findById(id).then(function (result) {
        console.log(result);
        res.render('compose', { title: 'compose', result: result });
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

    Docs.update({
        content: req.body.content,
        title: req.body.title
    }, {
            where: {
                id: id
            }
        }).then(function (result) {
            Docs.findById(id).then(function (result) {
                console.log(result);
                res.render('compose', { title: 'compose', result: result });
            });
        });
});

router.get('/login', function (req, res) {
    res.render('login')
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);


module.exports = router;
