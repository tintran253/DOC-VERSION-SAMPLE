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

/* GET users listing. */
router.get('/upload', function (req, res) {
    res.render('docv', { title: 'word docs' });
});

router.get('/compose', function (req, res) {
    const testFolder = './upload/';
    var result = [];
    Q.nfcall(fs.readdir, testFolder)
        .then(function (results) {
            console.log(results);
            res.render('compose', { title: 'compose', files: results });
        });
});

router.post('/', function (req, res) {
    var busboy = new Busboy({ headers: req.headers });
    var fileNames = [];
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var saveTo = path.join(path.parse(__dirname).dir, '/upload/', path.basename(filename));
        fileNames.push(saveTo)
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function () {
        Q.all([mammoth.convertToHtml({ path: fileNames[0] }), mammoth.convertToHtml({ path: fileNames[1] })]).spread(function (res1, res2) {
            var diffResult = diff.diffChars(res1.value, res2.value);
            var i = 0;
            var result = '';
            diffResult.forEach(function (part) {
                var state = part.added ? '+' :
                    part.removed ? '-' : '';
                //var color = part.added ? 'green' :
                //    part.removed ? 'red' : 'grey';
                result += state + part.value
                //console.log(i++, state, part.value);
            });
            res.render('docv', { title: 'words only', res1: res1.value, res2: res2.value, result: result });
        });
    });
    req.pipe(busboy);
});

module.exports = router;
