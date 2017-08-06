
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
        email: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        sides: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.JSON)
        },
        isRoot: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isSystem: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    users.associate = function (models) {
        //const users.permissions = users.hasMany(models.roles);
        //users.permissions.hasMany(models.sides);
    }
    return users;
};
//User.hasMany(DocsVersion);
//module.exports = User;
