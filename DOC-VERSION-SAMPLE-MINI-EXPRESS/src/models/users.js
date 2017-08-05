
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
        },
        sides: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    });
    //users.associate = function (models) {
    //    users.hasMany(models.sides, { as: 'sides' });
    //}
    return users;
};
//User.hasMany(DocsVersion);
//module.exports = User;
