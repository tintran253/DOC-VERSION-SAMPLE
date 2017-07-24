
var Sequelize = require("sequelize");
var sequelize = require("../repository/db");

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

module.exports = Docs;
