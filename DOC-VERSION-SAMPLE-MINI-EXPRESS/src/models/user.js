
var Sequelize = require("sequelize");
var sequelize = require("../repository/db");
//var DocsVersion = require("../models/docs-version")
const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }    
});

//User.hasMany(DocsVersion);
module.exports = User;
