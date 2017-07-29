'use strict';
var express = require('express');
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

var User = require("../src/models/user");
var Docs = require("../src/models/docs");

/* GET users listing. */
router.get('/', function (req, res) {
    res.render('upload', { title: 'word docs' });
});



router.post('/', function (req, res) {
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
            return Docs.sync().then(function () {
                return Docs.create({
                    title: fileName,
                    url: fullPath,
                    content: res1.value
                });
            });
        }).then(function (result) {
            res.render('upload', { title: 'words only', result: result.content });
        });
    });
    req.pipe(busboy);
});

module.exports = router;
