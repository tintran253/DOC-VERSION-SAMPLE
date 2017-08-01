
var Sequelize = require("sequelize");
var sequelize = require("../repository/db");
var User = require("../models/user");
const Docs = sequelize.define('docs', {
    title :{
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.TEXT
    },
});
Docs.belongsTo(User, { as: 'createdBy' });
module.exports = Docs;
