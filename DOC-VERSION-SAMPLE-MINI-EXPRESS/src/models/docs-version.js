
var Sequelize = require("sequelize");
var sequelize = require("../repository/db");
var Docs = require("../models/docs")
var User = require("../models/user")
const DocsVersion = sequelize.define('docs-version', {
    content: {
        type: Sequelize.TEXT
    }
});
DocsVersion.belongsTo(User, { as: 'updatedBy' });
DocsVersion.belongsTo(Docs, { as: 'docs' });

module.exports = DocsVersion;
