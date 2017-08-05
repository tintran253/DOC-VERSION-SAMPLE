
//var Sequelize = require("sequelize");
//var sequelize = require("../repository/db");
//var Docs = require("../models/docs")
//var User = require("../models/users")
module.exports = function (sequelize, DataTypes) {
    var docsVersions = sequelize.define('docsVersions', {
        content: {
            type: DataTypes.TEXT
        }
    });
    docsVersions.associate = function (models) {
        docsVersions.belongsTo(models.users, { as: 'updatedBy' });
        docsVersions.belongsTo(models.docs, { as: 'docs' });
    }
    return docsVersions;
};
