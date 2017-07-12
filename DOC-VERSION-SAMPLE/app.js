'use strict';
require("colors");
var mammoth = require("mammoth");
var Q = require("q");
var diff = require("diff");

Q.all([mammoth.convertToHtml({ path: "./doc/01.docx" }), mammoth.convertToHtml({ path: "./doc/02.docx" })]).spread(function (res1, res2) {
    console.log('a', res1.value);
    console.log('b', res2.value);
    var diffResult = diff.diffChars(res1.value, res2.value);
    var i = 0;
    diffResult.forEach(function (part) {
        var state = part.added ? 'added' :
            part.removed ? 'removed' : 'same';
        console.log(i++, state, part.value);
    });
});