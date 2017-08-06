'use strict';
var express = require('express');
var passport = require("passport");
var router = express.Router();
var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs');
var Busboy = require('busboy');
var wkhtmltopdf = require('wkhtmltopdf');

var mammoth = require("mammoth");
var Q = require("q");
var diff = require("diff");
var fs = require('fs');
var requestHandler = require("../src/common/requestHandler");
var responseHandler = require("../src/common/responseHandler");

var models = require("../src/models");

router.get('/',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
        res.render('docs/upload', { title: 'word docs' });
    });

router.post('/',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
        var busboy = new Busboy({ headers: req.headers });
        var fileName = "";
        var fullPath = "";
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            fileName = filename;
            fullPath = path.join(path.parse(__dirname).dir, '/upload/', path.basename(filename));
            file.pipe(fs.createWriteStream(fullPath));
        });
        busboy.on('finish', function () {
            var options = {
                styleMap: [
                    "b => b"
                ]
            };
            Q.all([mammoth.convertToHtml({ path: fullPath }, options)]).spread(function (res1) {
                return models.docs.create({
                    title: fileName,
                    url: fullPath,
                    content: res1.value
                }).then(function (createdDoc) {
                    return models.docsVersions.create({
                        content: createdDoc.content,
                        docsId: createdDoc.id,
                        updatedById: req.user.id
                    });
                });
            }).then(function (result) {
                res.render('docs/upload', { title: 'words only', result: result.content });
            });
        });
        req.pipe(busboy);
    });


router.get('/compose',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
        res.render('docs/compose', { title: 'compose docs' });
    });

router.post('/compose',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    responseHandler,
    function (req, res) {
        return models.docs.create({
            title: req.body.title,
            url: "",
            content: req.body.content
        }).then(function (createdDoc) {
            return models.docsVersions.create({
                content: createdDoc.content,
                docsId: createdDoc.id,
                updatedById: req.user.id
            });
        }).then(function (result) {
            res.redirect('/');
        });
    });
router.get('/exportpdf/:id', function (req, res) {
    var id = req.params.id;
    models.docsVersions.findAll({
        where: { docsId: id },
        order: [
            ['updatedAt', 'DESC']
        ],
        limit: 1
    }).then(function (result) {
        wkhtmltopdf(result[0].content)
            .pipe(res);    
    })    
});
module.exports = router;
