
var Sequelize = require("sequelize");
var sequelize = require("../repository/db");
var Docs = require("../models/docs")
var User = require("../models/user")
const DocsVersion = sequelize.define('docs-version', {
    docsId: {
        type: Sequelize.INTEGER,
        references: {
            // This is a reference to another model
            model: Docs,

            // This is the column name of the referenced model
            key: 'id',

            // This declares when to check the foreign key constraint. PostgreSQL only.
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    content: {
        type: Sequelize.TEXT
    }
    //,
    //updatedBy: {
    //    type: Sequelize.INTEGER,
    //    references: {
    //        // This is a reference to another model
    //        model: User,

    //        // This is the column name of the referenced model
    //        key: 'id',

    //        // This declares when to check the foreign key constraint. PostgreSQL only.
    //        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    //    }
    //},
});

DocsVersion.belongsTo(User, { as: 'updatedBy' });

module.exports = DocsVersion;
