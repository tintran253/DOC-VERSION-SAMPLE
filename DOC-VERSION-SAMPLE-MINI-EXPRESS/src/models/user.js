
var Sequelize = require("sequelize");
var sequelize = require("../repository/db");

const User = sequelize.define('user', {
    userName: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }    
});

module.exports = User;
