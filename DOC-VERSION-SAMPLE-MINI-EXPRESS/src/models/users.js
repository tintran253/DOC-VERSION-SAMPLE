
//var Sequelize = require("sequelize");
//var sequelize = require("../repository/db");
//var models = require("../models")
module.exports = function (sequelize, DataTypes) {
    var users = sequelize.define('users', {
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.JSON)
        },
        isRoot: DataTypes.BOOLEAN
    });
    users.associate = function (models) {
        //const users.permissions = users.hasMany(models.roles);
        //users.permissions.hasMany(models.sides);
    }
    return users;
};
//User.hasMany(DocsVersion);
//module.exports = User;
