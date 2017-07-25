
var Sequelize = require("sequelize");
var sequelize = require("../repository/db");

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }    
});

module.exports = User;
