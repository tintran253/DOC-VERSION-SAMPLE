'use strict';
require("colors");
var mammoth = require("mammoth");
var Q = require("q");
var diff = require("diff");
var prettydiff = require("prettydiff");
var Sequelize = require("sequelize");
var sequelize = require("./db");
var options = {
    styleMap: [
        "b => b"
    ]
};
//Q.all([mammoth.convertToHtml({ path: "./doc/01.docx" }, options), mammoth.convertToHtml({ path: "./doc/02.docx" }, options)])
//    .spread(function (res1, res2) {
//        console.log('a', res1.value);
//        console.log('b', res2.value);

//        var diffResult = diff.diffChars(res1.value, res2.value);
//        var i = 0;
//        var finalResult = "";
//        var remove = "";
//        diffResult.forEach(function (part) {
//            var state = part.added ? 'added' :
//                part.removed ? 'removed' : 'same';
//            if (state !== 'removed')
//                finalResult += part.value;
//            else {
//                remove += part.value;
//            }
//            console.log(i++, state, part.value);
//        });
//        console.log(finalResult);
//        console.log(remove);
//    });

//const User = sequelize.define('user', {
//    firstName: {
//        type: Sequelize.STRING
//    },
//    lastName: {
//        type: Sequelize.STRING
//    }
//});


//User.sync({ force: false }).then(() => {
//    // Table created
//    return User.create({
//        firstName: 'John',
//        lastName: 'Hancock'
//    });
//});

var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf('<p>Abc</p><p>Def</p><p><b>adwdadada</b></p>')
    .pipe(res);

