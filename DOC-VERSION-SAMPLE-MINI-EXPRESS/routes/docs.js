﻿'use strict';
var express = require('express');
var passport = require("passport");
var router = express.Router();
var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs');
var Busboy = require('busboy');
require("colors");
var mammoth = require("mammoth");
var Q = require("q");
var diff = require("diff");
var fs = require('fs');
var requestHandler = require("../src/common/requestHandler");

var User = require("../src/models/user");
var Docs = require("../src/models/docs");
var DocsVersion = require("../src/models/docs-version");

router.get('/',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    function (req, res) {
        res.render('upload', { title: 'word docs' });
    });

router.post('/',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
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
                return Docs.create({
                    title: fileName,
                    url: fullPath,
                    content: res1.value
                }).then(function (createdDoc) {
                    return DocsVersion.create({
                        content: createdDoc.content,
                        docsId: createdDoc.id,
                        updatedById: req.user.id
                    });
                });
            }).then(function (result) {
                res.render('upload', { title: 'words only', result: result.content });
            });
        });
        req.pipe(busboy);
    });


router.get('/compose',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    function (req, res) {
        res.render('docs/compose', { title: 'compose docs' });
    });

router.post('/compose',
    requestHandler,
    passport.authenticate('auth', { session: false, failureRedirect: '/login' }),
    function (req, res) {
        return Docs.create({
            title: req.body.title,
            url: "",
            content: req.body.content
        }).then(function (createdDoc) {
            return DocsVersion.create({
                content: createdDoc.content,
                docsId: createdDoc.id,
                updatedById: req.user.id
            });
        }).then(function (result) {
            res.redirect('/');
        });
    });


module.exports = router;
