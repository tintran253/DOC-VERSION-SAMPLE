
//var Sequelize = require("sequelize");
//var sequelize = require("../repository/db");
//var DocsVersion = require("../models/docsVersions")
module.exports = function (sequelize, DataTypes) {
    var users = sequelize.define('users', {
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    });
    return users;
};
//User.hasMany(DocsVersion);
//module.exports = User;
